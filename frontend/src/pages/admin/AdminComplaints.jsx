import { useState, useEffect } from 'react';
import { getAllComplaints, updateComplaintStatus } from '../../services/adminService';

const STATUS_STYLES = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  needs_info: 'bg-orange-100 text-orange-700',
};

function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [noteDrafts, setNoteDrafts] = useState({});

  const loadComplaints = () => {
    setLoading(true);
    getAllComplaints(filter === 'all' ? undefined : filter)
      .then((data) => setComplaints(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadComplaints();
  }, [filter]);

  const handleAction = async (id, status) => {
    try {
      await updateComplaintStatus(id, status, noteDrafts[id] || '');
      loadComplaints();
    } catch (err) {
      console.error(err);
    }
  };

  const needsDecision = (status) => status === 'pending' || status === 'needs_info';

  return (
    <div>
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Complaint Management</h1>

      <div className="flex gap-2 mb-6">
        {['pending', 'approved', 'rejected', 'needs_info', 'all'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded text-sm font-medium capitalize ${
              filter === f ? 'bg-blue-700 text-white' : 'bg-white text-gray-600 border'
            }`}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}
      {!loading && complaints.length === 0 && (
        <p className="text-gray-500">No complaints in this category.</p>
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
            <p className="text-sm text-gray-500 mb-1">
              By {c.user?.name} ({c.user?.email}) · Trust score: {c.user?.trustScore ?? 0}
            </p>
            <p className="text-sm text-gray-500 mb-2">{c.city} · {c.locationText}</p>
            <p className="text-gray-700 text-sm mb-3">{c.description}</p>

            {c.photoUrl && (
              <img src={c.photoUrl} alt="Evidence" className="w-32 h-32 object-cover rounded mb-3" />
            )}

            {c.adminNote && (
              <p className="text-sm text-gray-500 italic mb-3">Admin note: {c.adminNote}</p>
            )}

            {needsDecision(c.status) ? (
              <>
                <input
                  type="text"
                  placeholder="Admin note (optional)"
                  value={noteDrafts[c._id] || ''}
                  onChange={(e) => setNoteDrafts({ ...noteDrafts, [c._id]: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm mb-3"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction(c._id, 'approved')}
                    className="px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(c._id, 'rejected')}
                    className="px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleAction(c._id, 'needs_info')}
                    className="px-3 py-1.5 bg-orange-500 text-white text-sm rounded hover:bg-orange-600"
                  >
                    Request Info
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => handleAction(c._id, 'pending')}
                className="text-xs text-gray-500 underline hover:text-gray-700"
              >
                Reverse decision (move back to pending)
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminComplaints;