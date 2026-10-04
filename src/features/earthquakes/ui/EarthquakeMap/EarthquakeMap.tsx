import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Earthquake } from '../../model/types';
import { formatDateTime } from '../../../../shared/lib/formatDateTime';
import styles from './EarthquakeMap.module.scss';

interface Props {
  earthquakes: Earthquake[];
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export const EarthquakeMap = ({
  earthquakes,
  selectedId,
  onSelect,
  isLoading,
}: Props) => {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markers = useRef(new Map<string, L.CircleMarker>());
  const [tileError, setTileError] = useState(false);

  useEffect(() => {
    if (!container.current) return;

    const instance = L.map(container.current, {
      scrollWheelZoom: false,
      minZoom: 2,
      maxZoom: 12,
    }).setView([20, 0], 2);
    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(instance);

    tiles.on('tileerror', () => setTileError(true));
    map.current = instance;

    const observer = new ResizeObserver(() => instance.invalidateSize());

    observer.observe(container.current);

    return () => {
      observer.disconnect();
      instance.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    const instance = map.current;

    if (!instance) return;

    const layer = L.layerGroup().addTo(instance);

    const currentMarkers = markers.current;

    currentMarkers.clear();

    earthquakes.forEach((event) => {
      const marker = L.circleMarker([event.latitude, event.longitude], {
        radius: Math.max(5, Math.min(20, 5 + (event.magnitude ?? 0) * 2)),
        color: (event.magnitude ?? 0) >= 4.5 ? '#b35609' : '#087357',
        fillColor: (event.magnitude ?? 0) >= 4.5 ? '#ffba66' : '#71dfba',
        fillOpacity: 0.75,
        weight: 2,
      }).addTo(layer);
      const content = document.createElement('div');
      const title = document.createElement('strong');
      const details = document.createElement('p');

      title.textContent = event.place ?? 'Место не указано';
      details.textContent = `M ${event.magnitude?.toFixed(1) ?? '—'} · ${event.depthKm.toFixed(1)} км · ${formatDateTime(event.time)}`;
      content.append(title, details);
      marker.bindPopup(content);
      marker.on('click', () => onSelect(event.id));
      markers.current.set(event.id, marker);
    });

    return () => {
      layer.remove();
      currentMarkers.clear();
    };
  }, [earthquakes, onSelect]);

  useEffect(() => {
    const instance = map.current;
    const marker = selectedId ? markers.current.get(selectedId) : undefined;

    if (!instance) return;

    if (!marker) {
      instance.closePopup();
      instance.setView([20, 0], 2);

      return;
    }

    instance.setView(marker.getLatLng(), Math.max(instance.getZoom(), 5));
    marker.openPopup();
  }, [selectedId, earthquakes]);

  return (
    <section className={styles.panel} aria-label="Карта землетрясений">
      <div className={styles.heading}>
        <h2>Карта событий</h2>
        <span>Размер отметки — магнитуда · Янтарные: M ≥ 4,5</span>
      </div>
      {tileError && (
        <p role="status">
          Не удалось загрузить часть карты. События доступны в списке ниже.
        </p>
      )}
      <div
        ref={container}
        className={styles.map}
        aria-label="Интерактивная карта. Событие также можно выбрать в списке ниже."
      />
      {!isLoading && !earthquakes.length && (
        <p className={styles.empty}>Нет событий для отображения на карте.</p>
      )}
    </section>
  );
};
