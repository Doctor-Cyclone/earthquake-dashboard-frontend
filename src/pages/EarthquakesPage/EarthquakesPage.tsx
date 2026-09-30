import { AppHeader } from '../../components/AppHeader/AppHeader';
import { AppFooter } from '../../components/AppFooter/AppFooter';
import { useEarthquakes } from '../../features/earthquakes/model/useEarthquakes';
import { EarthquakeToolbar } from '../../features/earthquakes/ui/EarthquakeToolbar/EarthquakeToolbar';
import { EarthquakeSummary } from '../../features/earthquakes/ui/EarthquakeSummary/EarthquakeSummary';
import { EarthquakeEvents } from '../../features/earthquakes/ui/EarthquakeEvents/EarthquakeEvents';
import styles from './EarthquakesPage.module.scss';

export const EarthquakesPage = () => {
  const { feed, busy, errorMessage, refresh } = useEarthquakes();

  return (
    <main className={styles.page}>
      <AppHeader />
      <EarthquakeToolbar busy={busy} onRefresh={() => void refresh()} />
      {errorMessage && (
        <div className={styles.error} role="alert">
          {errorMessage}
          {feed && ' Показана последняя успешная загрузка.'}
        </div>
      )}
      <EarthquakeSummary earthquakes={feed?.earthquakes ?? null} />
      <EarthquakeEvents feed={feed} busy={busy} />
      <AppFooter />
    </main>
  );
};
