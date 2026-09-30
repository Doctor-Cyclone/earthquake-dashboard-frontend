import type { Feed } from '../../model/types'
import { formatDateTime } from '../../../../shared/lib/formatDateTime'
import { EarthquakeRow } from './EarthquakeRow'
import styles from './EarthquakeEvents.module.scss'

interface Props {
  feed: Feed | null
  busy: boolean
}

function EventList({ feed, busy }: Props) {
  if (!feed)
    return (
      <p className={styles.empty}>
        {busy
          ? 'Загружаем землетрясения за сутки…'
          : 'Список появится после успешного обновления.'}
      </p>
    )
  if (!feed.earthquakes.length)
    return <p className={styles.empty}>В полученной ленте нет землетрясений.</p>
  return (
    <div className={styles['table-wrap']}>
      <table>
        <thead>
          <tr>
            <th scope="col">Магнитуда</th>
            <th scope="col">Место</th>
            <th scope="col">Глубина</th>
            <th scope="col">Время</th>
          </tr>
        </thead>
        <tbody>
          {feed.earthquakes.map((event) => (
            <EarthquakeRow key={event.id} event={event} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function EarthquakeEvents({ feed, busy }: Props) {
  const status = busy
    ? 'Получаем данные…'
    : feed
      ? 'Загружено ' + formatDateTime(feed.fetchedAt)
      : 'Данные не загружены'
  return (
    <section className={styles.events} aria-busy={busy}>
      <div className={styles['section-title']}>
        <div>
          <h2>Последние события</h2>
          <p className="muted">От новых к более ранним</p>
        </div>
        <span className={styles.timestamp} role="status">
          {status}
        </span>
      </div>
      <EventList feed={feed} busy={busy} />
    </section>
  )
}
