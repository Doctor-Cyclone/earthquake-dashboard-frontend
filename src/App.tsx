import { useEffect, useRef, useState } from 'react'
import { loadEarthquakes } from './api'
import type { Feed } from './api'

const time = (value: string) => new Date(value).toLocaleString('ru-RU', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
export default function App() {
  const [feed, setFeed] = useState<Feed | null>(null)
  const [busy, setBusy] = useState(true)
  const [error, setError] = useState('')
  const active = useRef<AbortController | null>(null)
  async function refresh() {
    active.current?.abort()
    const controller = new AbortController()
    active.current = controller
    const timer = setTimeout(() => controller.abort(), 15000)
    setBusy(true)
    setError('')
    try { const result = await loadEarthquakes(controller.signal); if (active.current === controller) setFeed(result) }
    catch (problem) {
      if (active.current === controller) setError(problem instanceof Error && problem.name !== 'AbortError' ? problem.message : 'Ответ задерживается. Попробуйте обновить данные ещё раз.')
    } finally {
      clearTimeout(timer)
      if (active.current === controller) setBusy(false)
    }
  }
  useEffect(() => {
    const initialLoad = setTimeout(() => void refresh(), 0)
    return () => { clearTimeout(initialLoad); const previous = active.current; active.current = null; previous?.abort() }
  }, [])
  const magnitudes = feed?.earthquakes.flatMap(event => event.magnitude === null ? [] : [event.magnitude]) ?? []
  const maximum = magnitudes.length ? Math.max(...magnitudes).toFixed(1) : '—'
  return <main>
    <header><a className="brand" href="/" aria-label="Seismic — главная"><img src="/favicon.svg" alt="" />SEISMIC<span>Наблюдение за Землёй</span></a><span className="source">Данные USGS</span></header>
    <section className="heading"><div><p className="eyebrow">СЕЙСМИЧЕСКАЯ АКТИВНОСТЬ</p><h1>Землетрясения</h1><p className="muted">Весь мир · Последние 24 часа</p></div><button disabled={busy} onClick={() => void refresh()}>{busy ? 'Загрузка…' : 'Обновить данные'}</button></section>
    {error && <div className="error" role="alert">{error}{feed && ' Показана последняя успешная загрузка.'}</div>}
    <section className="stats" aria-label="Сводка за сутки">
      <article><p>Событий за сутки</p><strong>{feed ? feed.earthquakes.length : '—'}</strong><small>В суточной ленте USGS</small></article>
      <article><p>Максимальная магнитуда</p><strong>{maximum}<em> M</em></strong><small>Среди полученных событий</small></article>
      <article><p>Магнитуда 4,5 и выше</p><strong>{feed ? magnitudes.filter(value => value >= 4.5).length : '—'}</strong><small>Событий за последние сутки</small></article>
    </section>
    <section className="events" aria-busy={busy}>
      <div className="section-title"><div><h2>Последние события</h2><p className="muted">От новых к более ранним</p></div><span className="timestamp" role="status">{busy ? 'Получаем данные…' : feed ? `Загружено ${time(feed.fetchedAt)}` : 'Данные не загружены'}</span></div>
      {!feed ? <p className="empty">{busy ? 'Загружаем землетрясения за сутки…' : 'Список появится после успешного обновления.'}</p> : feed.earthquakes.length === 0 ? <p className="empty">В полученной ленте нет землетрясений.</p> : <div className="table-wrap"><table><thead><tr><th scope="col">Магнитуда</th><th scope="col">Место</th><th scope="col">Глубина</th><th scope="col">Время</th></tr></thead><tbody>{feed.earthquakes.map(event => <tr key={event.id}><td><span className={`magnitude ${(event.magnitude ?? 0) >= 4.5 ? 'high' : ''}`}>{event.magnitude?.toFixed(1) ?? '—'}</span></td><td><span className="place">{event.place ?? 'Место не указано'}</span><small>{event.latitude.toFixed(2)}°, {event.longitude.toFixed(2)}°</small></td><td className="nowrap">{event.depthKm.toFixed(1)} км</td><td className="nowrap"><time dateTime={event.time}>{time(event.time)}</time></td></tr>)}</tbody></table></div>}
    </section>
    <footer><span>Источник: <a href="https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php" target="_blank" rel="noreferrer">USGS Earthquake Hazards Program</a></span><span>Время в часовом поясе устройства · Обновление вручную</span></footer>
  </main>
}
