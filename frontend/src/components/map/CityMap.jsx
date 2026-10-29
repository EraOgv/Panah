import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { getHotspots } from '../../services/hotspotService';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const scamIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [30, 49],
  iconAnchor: [15, 49],
});

const safeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [30, 49],
  iconAnchor: [15, 49],
});

function FitBoundsToPins({ hotspots, cityLat, cityLng, cityZoom }) {
  const map = useMap();

  useEffect(() => {
    if (hotspots.length === 0) {
      map.setView([cityLat, cityLng], cityZoom);
      return;
    }
    const bounds = L.latLngBounds(hotspots.map((h) => [h.latitude, h.longitude]));
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
  }, [hotspots, cityLat, cityLng, cityZoom, map]);

  return null;
}

function CityMap({ city }) {
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getHotspots(city.value)
      .then((data) => setHotspots(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [city]);

  return (
    <div className="relative rounded-lg overflow-hidden shadow-md" style={{ height: '450px' }}>
      {loading && (
        <div className="absolute inset-0 z-10 bg-white/70 flex items-center justify-center">
          <p className="text-gray-500 text-sm">Loading map...</p>
        </div>
      )}
      <MapContainer
        center={[city.lat, city.lng]}
        zoom={city.zoom}
        scrollWheelZoom={true}
        dragging={true}
        doubleClickZoom={true}
        touchZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBoundsToPins hotspots={hotspots} cityLat={city.lat} cityLng={city.lng} cityZoom={city.zoom} />

        {hotspots.map((h) => (
          <Marker
            key={h._id}
            position={[h.latitude, h.longitude]}
            icon={h.type === 'scam' ? scamIcon : safeIcon}
          >
            {/* Hover preview — no click/close needed, moves between pins freely */}
            <Tooltip direction="top" offset={[0, -40]} opacity={1}>
              <span className="font-medium">{h.name}</span>
              <br />
              {h.type === 'scam' ? '⚠️ Scam Hotspot' : '✅ Safe Zone'}
            </Tooltip>

            {/* Click for full detail */}
            <Popup>
              <strong>{h.name}</strong>
              <br />
              <span className={h.type === 'scam' ? 'text-red-600' : 'text-blue-600'}>
                {h.type === 'scam' ? '⚠️ Scam Hotspot' : '✅ Safe Zone'}
              </span>
              <br />
              {h.description}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default CityMap;