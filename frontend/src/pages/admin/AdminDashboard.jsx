import { useState, useEffect } from 'react';
import { getDashboardStats } from '../../services/adminService';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then((data) => setStats(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const cards = stats
    ? [
        { label: 'Total Users', value: stats.totalUsers },
        { label: 'Total Complaints', value: stats.totalComplaints },
        { label: 'Pending Complaints', value: stats.pendingComplaints, highlight: true },
        { label: 'Approved Complaints', value: stats.approvedComplaints },
        { label: 'Rejected Complaints', value: stats.rejectedComplaints },
        { label: 'Verified Travelers', value: stats.verifiedTravelers },
        { label: 'Total Reviews', value: stats.totalReviews },
      ]
    : [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Dashboard Overview</h1>

      {loading && <p className="text-gray-500">Loading stats...</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`p-5 rounded-lg shadow-sm ${
              card.highlight ? 'bg-yellow-50 border border-yellow-300' : 'bg-white'
            }`}
          >
            <p className="text-sm text-gray-500 mb-1">{card.label}</p>
            <p className="text-3xl font-bold text-gray-800">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;