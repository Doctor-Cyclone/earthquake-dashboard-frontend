import { AppHeader } from '../../components/AppHeader/AppHeader';
import { AppFooter } from '../../components/AppFooter/AppFooter';
import { useEarthquakes } from '../../features/earthquakes/model/useEarthquakes';
import { EarthquakeToolbar } from '../../features/earthquakes/ui/EarthquakeToolbar/EarthquakeToolbar';
import { EarthquakeSummary } from '../../features/earthquakes/ui/EarthquakeSummary/EarthquakeSummary';
import { EarthquakeEvents } from '../../features/earthquakes/ui/EarthquakeEvents/EarthquakeEvents';
import styles from './EarthquakesPage.module.scss';

export function EarthquakesPage() {
  const { feed, busy, error, refresh } = useEarthquakes();

  return (
    <main className={styles.page}>
      <AppHeader />
      <EarthquakeToolbar busy={busy} onRefresh={() => void refresh()} />
      {error && (
        <div className={styles.error} role="alert">
          {error}
          {feed && ' Показана последняя успешная загрузка.'}
        </div>
      )}
      <EarthquakeSummary earthquakes={feed?.earthquakes ?? null} />
      <EarthquakeEvents feed={feed} busy={busy} />
      <AppFooter />
    </main>
  );
}
