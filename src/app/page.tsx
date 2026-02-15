import styles from "./page.module.css";
import Map from '@/components/map-components/Map';
import { MapConfig } from '@/interfaces/Map';

const mapConfig: MapConfig = {
  source: "/data/combined.json",
  colorTypes: {
    "Sensor": "#e67e22",
    "Station": "#f1c40f",
    "Protected Area": "#ff000088",
    "Protected Area text": "#ff0000ff"
  },
  center: [23.7275, 37.9838],
  zoom: 14,
  pitch: 0,
  bearing: 0
}

export default function Home() {
  return (
    <main>
      <div>
        <Map mapConfig={mapConfig} />
      </div>
    </main>
  );
}