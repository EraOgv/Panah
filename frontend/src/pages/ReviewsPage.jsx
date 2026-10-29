import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getApprovedReviews } from '../services/reviewService';
import ReportButton from '../components/ui/ReportButton';

function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getApprovedReviews()
      .then((data) => setReviews(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-blue-700">Traveler Reviews</h1>
          <Link
            to="/reviews/new"
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 text-sm"
          >
            Write a Review
          </Link>
        </div>

        {loading && <p className="text-gray-500">Loading reviews...</p>}

        {!loading && reviews.length === 0 && (
          <p className="text-gray-500">No reviews yet. Be the first to share your experience.</p>
        )}

        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white p-5 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-800">{review.user?.name}</span>
                {review.user?.isVerifiedTraveler && (
                  <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                    ✓ Verified Traveler
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-2 capitalize">{review.relatedTo} · {review.rating}★</p>
              <p className="text-gray-700 mb-3">{review.comment}</p>
              <ReportButton targetType="review" targetId={review._id} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ReviewsPage;