import styles from './AppHeader.module.scss';

export const AppHeader = () => {
  return (
    <header className={styles.header}>
      <a className={styles['brand']} href="/" aria-label="Seismic — главная">
        <img src="/favicon.svg" alt="" />
        SEISMIC<span>Наблюдение за Землёй</span>
      </a>
      <span className={styles['source']}>Данные USGS</span>
    </header>
  );
};
