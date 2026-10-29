import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createReview } from '../services/reviewService';

function WriteReviewPage() {
  const [relatedTo, setRelatedTo] = useState('hotel');
  const [proofType, setProofType] = useState('receipt');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!proofFile) {
      setError('Please attach a proof file (receipt, booking confirmation, etc.)');
      return;
    }

    const formData = new FormData();
    formData.append('relatedTo', relatedTo);
    formData.append('proofType', proofType);
    formData.append('rating', rating);
    formData.append('comment', comment);
    formData.append('proofFile', proofFile);

    try {
      setSubmitting(true);
      await createReview(formData);
      navigate('/reviews');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Write a Review</h2>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <label className="block text-sm font-medium text-gray-700 mb-1">This review is about</label>
        <select
          value={relatedTo}
          onChange={(e) => setRelatedTo(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
        >
          <option value="hotel">Hotel</option>
          <option value="restaurant">Restaurant</option>
          <option value="guide">Guide</option>
          <option value="taxi">Taxi</option>
        </select>

        <label className="block text-sm font-medium text-gray-700 mb-1">Proof type</label>
        <select
          value={proofType}
          onChange={(e) => setProofType(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
        >
          <option value="receipt">Receipt</option>
          <option value="booking_confirmation">Booking Confirmation</option>
          <option value="guide_photo">Guide Photo</option>
          <option value="contact_number">Contact Number</option>
          <option value="taxi_plate">Taxi Plate</option>
        </select>

        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>
          ))}
        </select>

        <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="4"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          required
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Upload proof (receipt, booking confirmation, etc.)
        </label>
        <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg py-3 mb-1 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
          <span className="text-sm text-gray-600">
             {proofFile ? proofFile.name : 'Click to choose a proof file'}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProofFile(e.target.files[0])}
            className="hidden"
          />
        </label>
        <p className="text-xs text-gray-400 mb-6">
          {proofFile ? 'File selected ✓' : 'No file chosen'}
        </p>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}

export default WriteReviewPage;