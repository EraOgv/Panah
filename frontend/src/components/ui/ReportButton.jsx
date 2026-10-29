import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { createReport } from '../../services/reportService';

const REASONS = ['spam', 'abuse', 'misleading', 'harassment', 'other'];

function ReportButton({ targetType, targetId }) {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('spam');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createReport(targetType, targetId, reason, note);
      setSubmitted(true);
      setTimeout(() => setOpen(false), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report');
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="text-xs text-gray-400 hover:text-red-600"
      >
         Report
      </button>

      {open && (
        <div className="absolute z-10 mt-2 w-64 bg-white border rounded-lg shadow-lg p-4 text-sm left-0">
          {submitted ? (
            <p className="text-green-600">Report submitted. Thank you.</p>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && <p className="text-red-600 text-xs mb-2">{error}</p>}
              <label className="block text-xs font-medium text-gray-700 mb-1">Reason</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1 mb-2 text-xs"
              >
                {REASONS.map((r) => (
                  <option key={r} value={r} className="capitalize">{r}</option>
                ))}
              </select>
              <textarea
                placeholder="Optional note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows="2"
                className="w-full border border-gray-300 rounded px-2 py-1 mb-2 text-xs"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 border text-gray-600 rounded py-1 text-xs hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white rounded py-1 text-xs hover:bg-red-700"
                >
                  Submit
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default ReportButton;