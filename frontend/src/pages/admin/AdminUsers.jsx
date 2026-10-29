import { useState, useEffect } from 'react';
import { getAllUsers, toggleSuspendUser, toggleVerifiedTraveler } from '../../services/adminService';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = () => {
    setLoading(true);
    getAllUsers()
      .then((data) => setUsers(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSuspend = async (id) => {
    await toggleSuspendUser(id);
    loadUsers();
  };

  const handleVerify = async (id) => {
    await toggleVerifiedTraveler(id);
    loadUsers();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-blue-700 mb-6">User Management</h1>

      {loading && <p className="text-gray-500">Loading...</p>}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Trust Score</th>
              <th className="px-4 py-3">Verified</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((u) => (
              <tr key={u._id}>
                <td className="px-4 py-3 font-medium text-gray-800">{u.name}</td>
                <td className="px-4 py-3 text-gray-600">{u.email}</td>
                <td className="px-4 py-3 capitalize">{u.role}</td>
                <td className="px-4 py-3">{u.trustScore}</td>
                <td className="px-4 py-3">
                  {u.isVerifiedTraveler ? (
                    <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                      ✓ Verified
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs">Not verified</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {u.suspended ? (
                    <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full">
                      Suspended
                    </span>
                  ) : (
                    <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                      Active
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 space-x-2">
                  <button
                    onClick={() => handleVerify(u._id)}
                    className="text-xs text-blue-700 underline hover:text-blue-900"
                  >
                    {u.isVerifiedTraveler ? 'Revoke' : 'Verify'}
                  </button>
                  <button
                    onClick={() => handleSuspend(u._id)}
                    className="text-xs text-red-600 underline hover:text-red-800"
                  >
                    {u.suspended ? 'Unsuspend' : 'Suspend'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsers;