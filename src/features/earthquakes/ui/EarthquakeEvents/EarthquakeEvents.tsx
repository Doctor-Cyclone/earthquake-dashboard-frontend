import type { Feed } from '../../model/types';
import { formatDateTime } from '../../../../shared/lib/formatDateTime';
import { EarthquakeRow } from './EarthquakeRow';
import styles from './EarthquakeEvents.module.scss';

interface Props {
  feed: Feed | null;
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const EventList = ({ feed, isLoading, selectedId, onSelect }: Props) => {
  if (!feed)
    return (
      <p className={styles.empty}>
        {isLoading
          ? 'Загружаем землетрясения за сутки…'
          : 'Список появится после успешного обновления.'}
      </p>
    );

  if (!feed.earthquakes.length)
    return <p className={styles.empty}>В полученной ленте нет землетрясений.</p>;

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
            <EarthquakeRow
              key={event.id}
              event={event}
              isSelected={selectedId === event.id}
              onSelect={onSelect}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const EarthquakeEvents = ({ feed, isLoading, selectedId, onSelect }: Props) => {
  const status = isLoading
    ? 'Получаем данные…'
    : feed
      ? 'Загружено ' + formatDateTime(feed.fetchedAt)
      : 'Данные не загружены';

  return (
    <section className={styles.events} aria-busy={isLoading}>
      <div className={styles['section-title']}>
        <div>
          <h2>Последние события</h2>
          <p className="muted">От новых к более ранним</p>
        </div>
        <span className={styles.timestamp} role="status">
          {status}
        </span>
      </div>
      <EventList
        feed={feed}
        isLoading={isLoading}
        selectedId={selectedId}
        onSelect={onSelect}
      />
    </section>
  );
};
