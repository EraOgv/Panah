import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createComplaint } from '../services/complaintService';

const SCAM_CATEGORIES = [
  'Taxi Scam',
  'Hotel Scam',
  'Fake Guide',
  'Pickpocket',
  'Unsafe Area',
  'Fake Currency Exchange',
  'Restaurant Fraud',
  'Vehicle/Equipment Rental Scam',
  'Free-Gift Trap',
];

function ComplaintFormPage() {
  const [scamCategory, setScamCategory] = useState(SCAM_CATEGORIES[0]);
  const [city, setCity] = useState('');
  const [locationText, setLocationText] = useState('');
  const [description, setDescription] = useState('');
  const [dateOfIncident, setDateOfIncident] = useState('');
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const formData = new FormData();
    formData.append('scamCategory', scamCategory);
    formData.append('city', city);
    formData.append('locationText', locationText);
    formData.append('description', description);
    formData.append('dateOfIncident', dateOfIncident);
    if (photo) formData.append('photo', photo);

    try {
      setSubmitting(true);
      await createComplaint(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">File a Complaint</h2>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <label className="block text-sm font-medium text-gray-700 mb-1">Scam Category</label>
        <select
          value={scamCategory}
          onChange={(e) => setScamCategory(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
        >
          {SCAM_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="e.g. Kuala Lumpur"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          required
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
        <input
          type="text"
          value={locationText}
          onChange={(e) => setLocationText(e.target.value)}
          placeholder="e.g. Bukit Bintang"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          required
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          required
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Incident</label>
        <input
          type="date"
          value={dateOfIncident}
          onChange={(e) => setDateOfIncident(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          required
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Photo (optional)
        </label>
        <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg py-3 mb-1 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
          <span className="text-sm text-gray-600">
             {photo ? photo.name : 'Click to choose a photo'}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
            className="hidden"
          />
        </label>
        <p className="text-xs text-gray-400 mb-6">
          {photo ? 'Photo selected ✓' : 'No file chosen'}
        </p>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </form>
    </div>
  );
}

export default ComplaintFormPage;