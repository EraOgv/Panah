import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { updateProfile } from '../services/authService';

function ProfilePage() {
  const { user, setUser } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [picture, setPicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const startEditing = () => {
    setName(user?.name || '');
    setPicture(null);
    setPreviewUrl(null);
    setMessage('');
    setError('');
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setPicture(null);
    setPreviewUrl(null);
    setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPicture(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const formData = new FormData();
    formData.append('name', name);
    if (picture) formData.append('profilePicture', picture);

    try {
      setSaving(true);
      const updated = await updateProfile(formData);
      setUser(updated);
      setMessage('Profile updated successfully');
      setEditing(false);
      setPicture(null);
      setPreviewUrl(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">My Profile</h2>

        {message && !editing && <p className="text-green-600 text-sm mb-4 text-center">{message}</p>}

        <div className="flex flex-col items-center mb-6">
          <img
            src={previewUrl || user?.profilePicture || 'https://via.placeholder.com/100?text=No+Photo'}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover mb-2 border"
          />
          {user?.isVerifiedTraveler && (
            <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
              ✓ Verified Traveler
            </span>
          )}
        </div>

        {!editing ? (
          <>
            <div className="mb-4">
              <p className="text-xs text-gray-500 uppercase mb-1">Name</p>
              <p className="text-gray-800 font-medium">{user?.name}</p>
            </div>
            <div className="mb-6">
              <p className="text-xs text-gray-500 uppercase mb-1">Email</p>
              <p className="text-gray-800 font-medium">{user?.email}</p>
            </div>
            <button
              onClick={startEditing}
              className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition"
            >
              Edit Profile
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4 bg-gray-100 text-gray-500"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Update profile picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full mb-6 text-sm"
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={cancelEditing}
                className="w-1/2 border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="w-1/2 bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;