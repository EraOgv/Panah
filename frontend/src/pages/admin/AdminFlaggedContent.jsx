import { useState, useEffect } from 'react';
import { getFlaggedItems, resolveFlag, removeFlaggedItem } from '../../services/reportService';

function AdminFlaggedContent() {
  const [data, setData] = useState({ complaints: [], reviews: [] });
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getFlaggedItems()
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleResolve = async (targetType, targetId) => {
    await resolveFlag(targetType, targetId);
    load();
  };

  const handleRemove = async (targetType, targetId) => {
    await removeFlaggedItem(targetType, targetId);
    load();
  };

  const items = [
    ...data.complaints.map((c) => ({ ...c, targetType: 'complaint', title: c.scamCategory, text: c.description })),
    ...data.reviews.map((r) => ({ ...r, targetType: 'review', title: r.relatedTo, text: r.comment })),
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Flagged Content</h1>

      {loading && <p className="text-gray-500">Loading...</p>}
      {!loading && items.length === 0 && (
        <p className="text-gray-500">No flagged content right now — nothing needs your attention.</p>
      )}

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item._id} className="bg-white p-5 rounded-lg shadow-sm border border-red-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-800 capitalize">{item.title}</span>
              <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full">
                {item.flagCount} report{item.flagCount > 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-2">By {item.user?.name} ({item.user?.email})</p>
            <p className="text-gray-700 text-sm mb-4">{item.text}</p>

            <div className="flex gap-2">
              <button
                onClick={() => handleResolve(item.targetType, item._id)}
                className="px-3 py-1.5 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
              >
                Dismiss Flag (Keep)
              </button>
              <button
                onClick={() => handleRemove(item.targetType, item._id)}
                className="px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Remove Content
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminFlaggedContent;