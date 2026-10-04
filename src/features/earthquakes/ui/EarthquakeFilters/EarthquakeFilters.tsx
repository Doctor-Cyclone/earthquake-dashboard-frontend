import { useState } from 'react';
import type { FormEvent } from 'react';
import type { EarthquakeFilters } from '../../model/types';
import styles from './EarthquakeFilters.module.scss';

const fields = [
  { name: 'minMagnitude', label: 'Магнитуда от' },
  { name: 'maxMagnitude', label: 'Магнитуда до' },
  { name: 'minDepth', label: 'Глубина от, км' },
  { name: 'maxDepth', label: 'Глубина до, км' },
] as const;

interface Props {
  isLoading: boolean;
  onApply: (filters: EarthquakeFilters) => void;
}

export const EarthquakeFiltersForm = ({ isLoading, onApply }: Props) => {
  const [errorMessage, setErrorMessage] = useState('');

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const values = new FormData(event.currentTarget);
    const filters: EarthquakeFilters = {};

    for (const { name } of fields) {
      const value = String(values.get(name) ?? '').trim();

      if (value === '') continue;

      if (!/^-?\d+(?:\.\d+)?$/.test(value) || !Number.isFinite(Number(value))) {
        setErrorMessage('Укажите конечные числа с десятичной точкой.');

        return;
      }

      filters[name] = Number(value);
    }

    if (
      (filters.minMagnitude !== undefined &&
        filters.maxMagnitude !== undefined &&
        filters.minMagnitude > filters.maxMagnitude) ||
      (filters.minDepth !== undefined &&
        filters.maxDepth !== undefined &&
        filters.minDepth > filters.maxDepth)
    ) {
      setErrorMessage('Значение «от» не может быть больше значения «до».');

      return;
    }

    setErrorMessage('');
    onApply(filters);
  };

  const reset = () => {
    setErrorMessage('');
    onApply({});
  };

  return (
    <form
      className={styles.form}
      onSubmit={submit}
      onReset={reset}
      aria-label="Фильтры землетрясений"
    >
      <fieldset disabled={isLoading}>
        <legend>Фильтры событий</legend>
        <div className={styles.fields}>
          {fields.map(({ name, label }) => (
            <label key={name}>
              {label}
              <input name={name} type="number" step="any" placeholder="Любая" />
            </label>
          ))}
          <button type="submit">Применить</button>
          <button type="reset" className={styles.reset}>
            Сбросить
          </button>
        </div>
      </fieldset>
      <p>
        Карта, сводка и список показывают одну выборку. Изменения действуют после нажатия
        «Применить».
      </p>
      {errorMessage && (
        <p role="alert" className={styles.error}>
          {errorMessage}
        </p>
      )}
    </form>
  );
};
