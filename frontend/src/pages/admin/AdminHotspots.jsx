import { useState, useEffect } from 'react';
import { CITIES } from '../../utils/constants';
import { getHotspots } from '../../services/hotspotService';
import api from '../../services/api';

function AdminHotspots() {
  const [city, setCity] = useState(CITIES[0].value);
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', type: 'scam', latitude: '', longitude: '', description: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadHotspots = () => {
    setLoading(true);
    getHotspots(city)
      .then((data) => setHotspots(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadHotspots();
  }, [city]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.latitude || !form.longitude || !form.description) {
      setError('Please fill all fields');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/hotspots', {
        city,
        name: form.name,
        type: form.type,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        description: form.description,
      });
      setForm({ name: '', type: 'scam', latitude: '', longitude: '', description: '' });
      loadHotspots();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create hotspot');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Scam Hotspots</h1>

      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
      <select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="w-full max-w-xs border border-gray-300 rounded px-3 py-2 mb-6"
      >
        {CITIES.map((c) => (
          <option key={c.value} value={c.value}>{c.label}</option>
        ))}
      </select>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Add New Hotspot</h2>
          <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg shadow-sm">
            {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

            <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-1.5 mb-3 text-sm"
            />

            <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-1.5 mb-3 text-sm"
            >
              <option value="scam">Scam Hotspot</option>
              <option value="safe">Safe Zone</option>
            </select>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={form.latitude}
                  onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={form.longitude}
                  onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
                />
              </div>
            </div>

            <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows="3"
              className="w-full border border-gray-300 rounded px-3 py-1.5 mb-4 text-sm"
            />

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-700 text-white py-1.5 rounded text-sm hover:bg-blue-800 disabled:opacity-50"
            >
              {submitting ? 'Adding...' : 'Add Hotspot'}
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Existing Hotspots ({hotspots.length})
          </h2>
          {loading && <p className="text-gray-500 text-sm">Loading...</p>}
          <div className="space-y-2">
            {hotspots.map((h) => (
              <div key={h._id} className="bg-white p-3 rounded-lg shadow-sm text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">{h.name}</span>
                  <span className={h.type === 'scam' ? 'text-red-600' : 'text-blue-600'}>
                    {h.type === 'scam' ? '🔴 Scam' : '🔵 Safe'}
                  </span>
                </div>
                <p className="text-gray-500 text-xs mt-1">{h.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHotspots;