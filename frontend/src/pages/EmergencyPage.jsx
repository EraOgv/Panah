import { useState, useEffect } from 'react';
import { getEmergencyContacts } from '../services/emergencyService';
import { CITIES } from '../utils/constants';

// Only show contacts within this distance of the user in GPS mode
const MAX_DISTANCE_KM = 50;

const TYPE_LABELS = {
  police: ' Police',
  hospital: ' Hospital',
  embassy: ' Embassy',
  pharmacy: ' Pharmacy',
};

function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function EmergencyPage() {
  const [mode, setMode] = useState('gps');
  const [city, setCity] = useState(CITIES[0].value);
  const [contacts, setContacts] = useState([]);
  const [nearest, setNearest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    if (mode !== 'gps') return;

    setLoading(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setMode('manual');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const all = await getEmergencyContacts();
          const withDistance = all
            .filter((c) => c.latitude && c.longitude)
            .map((c) => ({
              ...c,
              distance: getDistanceKm(latitude, longitude, c.latitude, c.longitude),
            }))
            .sort((a, b) => a.distance - b.distance);

          setNearest(withDistance[0] || null);
          setContacts(withDistance.filter((c) => c.distance <= MAX_DISTANCE_KM));
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error(err);
        setLocationError('Location access denied. Switch to manual city selection below.');
        setLoading(false);
      }
    );
  }, [mode]);

  useEffect(() => {
    if (mode !== 'manual') return;
    setLoading(true);
    getEmergencyContacts(city)
      .then((data) => setContacts(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [mode, city]);

  const grouped = contacts.reduce((acc, c) => {
    if (!acc[c.type]) acc[c.type] = [];
    acc[c.type].push(c);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-700 mb-2">Emergency Help</h1>
        <p className="text-gray-600 mb-4">Find nearby police, hospitals, embassies, and pharmacies.</p>

        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs rounded-lg px-4 py-3 mb-6">
          ⚠️ Contact information is provided for demonstration purposes and may not be fully verified or up to date. In a real emergency, please confirm details with official local sources.
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode('gps')}
            className={`px-3 py-1.5 rounded text-sm font-medium ${
              mode === 'gps' ? 'bg-blue-700 text-white' : 'bg-white text-gray-600 border'
            }`}
          >
            📍 Use My Location
          </button>
          <button
            onClick={() => setMode('manual')}
            className={`px-3 py-1.5 rounded text-sm font-medium ${
              mode === 'manual' ? 'bg-blue-700 text-white' : 'bg-white text-gray-600 border'
            }`}
          >
            Choose City Manually
          </button>
        </div>

        {locationError && <p className="text-sm text-red-600 mb-4">{locationError}</p>}

        {mode === 'manual' && (
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-6"
          >
            {CITIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        )}

        {loading && <p className="text-gray-500">Loading...</p>}

        {mode === 'gps' && !loading && !locationError && contacts.length === 0 && (
          <div className="bg-white p-4 rounded-lg shadow-sm text-sm text-gray-600">
            <p className="mb-1">
              No emergency contacts are listed within {MAX_DISTANCE_KM} km of your location.
            </p>
            {nearest && (
              <p>
                The nearest one we have is {nearest.name}, about {Math.round(nearest.distance)} km away.
                Use "Choose City Manually" to browse a city.
              </p>
            )}
          </div>
        )}

        {mode === 'manual' && !loading && contacts.length === 0 && (
          <p className="text-gray-500">No emergency contacts available for this city yet.</p>
        )}

        {mode === 'gps' && !loading && contacts.length > 0 && (
          <div className="space-y-3">
            {contacts.map((c) => (
              <div key={c._id} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-800">{TYPE_LABELS[c.type]} — {c.name}</p>
                  <span className="text-xs text-gray-500">{c.distance.toFixed(1)} km away</span>
                </div>
                <p className="text-sm text-gray-600">{c.address}</p>
                <a href={`tel:${c.phone}`} className="text-blue-700 text-sm font-medium">
                  {c.phone}
                </a>
              </div>
            ))}
          </div>
        )}

        {mode === 'manual' &&
          Object.keys(grouped).map((type) => (
            <div key={type} className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {TYPE_LABELS[type] || type}
              </h2>
              <div className="space-y-3">
                {grouped[type].map((c) => (
                  <div key={c._id} className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="font-medium text-gray-800">{c.name}</p>
                    <p className="text-sm text-gray-600">{c.address}</p>
                    <a href={`tel:${c.phone}`} className="text-blue-700 text-sm font-medium">
                      {c.phone}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default EmergencyPage;