import type { Earthquake } from '../../model/types';
import { formatDateTime } from '../../../../shared/lib/formatDateTime';
import styles from './EarthquakeEvents.module.scss';

interface Props {
  event: Earthquake;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const EarthquakeRow = ({ event, isSelected, onSelect }: Props) => {
  const magnitudeClass = [
    styles.magnitude,
    (event.magnitude ?? 0) >= 4.5 ? styles.high : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <tr className={isSelected ? styles.selected : undefined}>
      <td>
        <span className={magnitudeClass}>{event.magnitude?.toFixed(1) ?? '—'}</span>
      </td>
      <td>
        <button
          className={styles.eventButton}
          aria-pressed={isSelected}
          onClick={() => onSelect(event.id)}
        >
          {event.place ?? 'Место не указано'}
        </button>
        <small>
          {event.latitude.toFixed(2)}°, {event.longitude.toFixed(2)}°
        </small>
      </td>
      <td className={styles.nowrap}>{event.depthKm.toFixed(1)} км</td>
      <td className={styles.nowrap}>
        <time dateTime={event.time}>{formatDateTime(event.time)}</time>
      </td>
    </tr>
  );
};
