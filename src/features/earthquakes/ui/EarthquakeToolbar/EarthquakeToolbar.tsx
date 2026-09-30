import styles from './EarthquakeToolbar.module.scss';

interface Props {
  isLoading: boolean;
  onRefresh: () => void;
}

export const EarthquakeToolbar = ({ isLoading, onRefresh }: Props) => {
  return (
    <section className={styles['heading']}>
      <div>
        <p className={styles['eyebrow']}>СЕЙСМИЧЕСКАЯ АКТИВНОСТЬ</p>
        <h1>Землетрясения</h1>
        <p className="muted">Весь мир · Последние 24 часа</p>
      </div>
      <button disabled={isLoading} onClick={onRefresh}>
        {isLoading ? 'Загрузка…' : 'Обновить данные'}
      </button>
    </section>
  );
};
