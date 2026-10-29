import { useState, useEffect } from 'react';
import api from '../services/api';

function MyReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reviews/mine')
      .then((res) => setReviews(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-700 mb-6">My Reviews</h1>

        {loading && <p className="text-gray-500">Loading...</p>}

        {!loading && reviews.length === 0 && (
          <p className="text-gray-500">You haven't written any reviews yet.</p>
        )}

        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r._id} className="bg-white p-5 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500 mb-1 capitalize">{r.relatedTo} · {r.rating}★</p>
              <p className="text-gray-700">{r.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyReviewsPage;