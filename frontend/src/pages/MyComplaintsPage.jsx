import { useState, useEffect } from 'react';
import { getMyComplaints } from '../services/complaintService';

const STATUS_STYLES = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  needs_info: 'bg-orange-100 text-orange-700',
};

function MyComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyComplaints()
      .then((data) => setComplaints(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-700 mb-6">My Complaints</h1>

        {loading && <p className="text-gray-500">Loading...</p>}

        {!loading && complaints.length === 0 && (
          <p className="text-gray-500">You haven't filed any complaints yet.</p>
        )}

        <div className="space-y-4">
          {complaints.map((c) => (
            <div key={c._id} className="bg-white p-5 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-800">{c.scamCategory}</span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${STATUS_STYLES[c.status]}`}>
                  {c.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-2">{c.city} · {c.locationText}</p>
              <p className="text-gray-700 text-sm">{c.description}</p>
              {c.adminNote && (
                <p className="text-sm text-gray-500 mt-2 italic">Admin note: {c.adminNote}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyComplaintsPage;