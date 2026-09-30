import type { Earthquake } from '../../model/types';
import { getEarthquakeSummary } from '../../model/getEarthquakeSummary';
import styles from './EarthquakeSummary.module.scss';

interface Props {
  earthquakes: Earthquake[] | null;
}

interface StatCardProps {
  label: string;
  value: string | number;
  note: string;
  unit?: string;
}

const StatCard = ({ label, value, note, unit }: StatCardProps) => {
  return (
    <article>
      <p>{label}</p>
      <strong>
        {value}
        {unit && <em> {unit}</em>}
      </strong>
      <small>{note}</small>
    </article>
  );
};

export const EarthquakeSummary = ({ earthquakes }: Props) => {
  const summary = earthquakes ? getEarthquakeSummary(earthquakes) : null;

  return (
    <section className={styles.stats} aria-label="Сводка за сутки">
      <StatCard
        label="Событий за сутки"
        value={summary?.count ?? '—'}
        note="В суточной ленте USGS"
      />
      <StatCard
        label="Максимальная магнитуда"
        value={summary?.maximum?.toFixed(1) ?? '—'}
        unit="M"
        note="Среди полученных событий"
      />
      <StatCard
        label="Магнитуда 4,5 и выше"
        value={summary?.significantCount ?? '—'}
        note="Событий за последние сутки"
      />
    </section>
  );
};
