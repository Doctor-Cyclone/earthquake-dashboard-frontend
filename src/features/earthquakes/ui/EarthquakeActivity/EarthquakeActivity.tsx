import { getHourlyActivity } from '../../model/getHourlyActivity';
import type { Feed } from '../../model/types';
import { formatDateTime } from '../../../../shared/lib/formatDateTime';
import styles from './EarthquakeActivity.module.scss';

interface Props {
  feed: Feed | null;
  isLoading: boolean;
}

const timeFormatter = new Intl.DateTimeFormat('ru-RU', {
  hour: '2-digit',
  minute: '2-digit',
});

export const EarthquakeActivity = ({ feed, isLoading }: Props) => {
  const buckets = feed ? getHourlyActivity(feed.earthquakes, feed.generatedAt) : [];
  const maximum = Math.max(1, ...buckets.map(({ count }) => count));
  const total = buckets.reduce((sum, { count }) => sum + count, 0);
  const first = buckets[0];
  const last = buckets[buckets.length - 1];

  return (
    <section className={styles.panel} aria-label="Активность по часам">
      <div className={styles.heading}>
        <h2>Активность по часам</h2>
        <p>Количество событий · С учётом фильтров</p>
      </div>
      {!first || !last ? (
        <p role="status">{isLoading ? 'Загрузка графика…' : 'Нет данных для графика.'}</p>
      ) : (
        <>
          <p className={styles.period}>
            {formatDateTime(new Date(first.start).toISOString())} —{' '}
            {formatDateTime(new Date(last.end).toISOString())}
            {' · Время устройства'}
          </p>
          {total === 0 && (
            <p role="status">За этот период нет событий по выбранным фильтрам.</p>
          )}
          <div className={styles.scroll}>
            <div className={styles.chart}>
              <div className={styles.scale} aria-hidden="true">
                <span>{maximum}</span>
                <span>0</span>
              </div>
              <ol
                className={styles.bars}
                aria-label="Количество землетрясений за каждый час"
              >
                {buckets.map((bucket, index) => {
                  const label = timeFormatter.format(bucket.start);
                  const description = `${formatDateTime(new Date(bucket.start).toISOString())} — ${timeFormatter.format(bucket.end)} · Событий: ${bucket.count}`;

                  return (
                    <li
                      key={bucket.start}
                      className={styles.column}
                      tabIndex={0}
                      aria-label={description}
                    >
                      <span className={styles.mobileCount} aria-hidden="true">
                        {bucket.count}
                      </span>
                      <span className={styles.tooltip} aria-hidden="true">
                        {description}
                      </span>
                      <span className={styles.track} aria-hidden="true">
                        <span
                          className={styles.bar}
                          style={{ height: `${(bucket.count / maximum) * 100}%` }}
                        />
                      </span>
                      <span className={styles.label} aria-hidden="true">
                        {index % 3 === 0 ? label : ''}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
          <p className={styles.hint}>
            <span className={styles.mobileHint}>
              Проведите по графику влево, чтобы увидеть остальные часы.{' '}
            </span>
            Каждый столбец — один час. Наведите курсор или выберите столбец клавишей Tab,
            чтобы увидеть число событий.
          </p>
        </>
      )}
    </section>
  );
};
