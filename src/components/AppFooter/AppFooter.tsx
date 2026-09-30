import styles from './AppFooter.module.scss'
export function AppFooter() {
  return (
    <footer className={styles.footer}>
      <span>
        Источник:{' '}
        <a
          href="https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php"
          target="_blank"
          rel="noreferrer"
        >
          USGS Earthquake Hazards Program
        </a>
      </span>
      <span>Время в часовом поясе устройства · Обновление вручную</span>
    </footer>
  )
}
