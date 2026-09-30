import type { Earthquake } from '../../model/types';
import { formatDateTime } from '../../../../shared/lib/formatDateTime';
import styles from './EarthquakeEvents.module.scss';

export const EarthquakeRow = ({ event }: { event: Earthquake }) => {
  const magnitudeClass = [
    styles.magnitude,
    (event.magnitude ?? 0) >= 4.5 ? styles.high : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <tr>
      <td>
        <span className={magnitudeClass}>{event.magnitude?.toFixed(1) ?? '—'}</span>
      </td>
      <td>
        <span className={styles.place}>{event.place ?? 'Место не указано'}</span>
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
