import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getApprovedComplaints } from '../services/complaintService';
import ReportButton from '../components/ui/ReportButton';

function ComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getApprovedComplaints()
      .then((data) => setComplaints(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-blue-700">Reported Scams</h1>
          <Link
            to="/complaints/new"
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 text-sm"
          >
            File a Complaint
          </Link>
        </div>

        {loading && <p className="text-gray-500">Loading...</p>}

        {!loading && complaints.length === 0 && (
          <p className="text-gray-500">No approved reports yet.</p>
        )}

        <div className="space-y-4">
          {complaints.map((c) => (
            <div key={c._id} className="bg-white p-5 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-800">{c.scamCategory}</span>
                {c.user?.isVerifiedTraveler && (
                  <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                    ✓ Verified Traveler
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-2">
                By {c.user?.name} · {c.city} · {c.locationText}
              </p>
              <p className="text-gray-700 mb-3">{c.description}</p>
              {c.photoUrl && (
                <img src={c.photoUrl} alt="Evidence" className="w-32 h-32 object-cover rounded mb-3" />
              )}
              <ReportButton targetType="complaint" targetId={c._id} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ComplaintsPage;