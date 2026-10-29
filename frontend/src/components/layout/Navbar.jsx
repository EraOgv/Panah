import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [complaintMenuOpen, setComplaintMenuOpen] = useState(false);

  const closeAllMenus = () => {
    setMenuOpen(false);
    setComplaintMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeAllMenus();
    navigate('/');
  };

  return (
    <nav className="bg-blue-700 text-white px-6 py-4 flex items-center justify-between relative">
      <Link to="/" onClick={closeAllMenus} className="text-xl font-bold">PANAH</Link>

      <div className="flex items-center gap-6 text-sm font-medium">
        <Link to="/" onClick={closeAllMenus} className="hover:text-blue-200">Home</Link>

        <div className="relative">
          <button
            onClick={() => {
              setComplaintMenuOpen(!complaintMenuOpen);
              setMenuOpen(false);
            }}
            className="hover:text-blue-200"
          >
            File a Complaint ▾
          </button>
          {complaintMenuOpen && (
            <div className="absolute left-0 mt-2 w-52 bg-white text-gray-800 rounded shadow-lg py-2 text-sm">
              <Link
                to="/complaints"
                onClick={closeAllMenus}
                className="block px-4 py-2 hover:bg-gray-100"
              >
                View Reported Scams
              </Link>
              <Link
                to="/complaints/new"
                onClick={closeAllMenus}
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Report a Scam
              </Link>
            </div>
          )}
        </div>

        <Link to="/reviews" onClick={closeAllMenus} className="hover:text-blue-200">Reviews</Link>
        <Link to="/emergency" onClick={closeAllMenus} className="hover:text-blue-200">Emergency Help</Link>
        {user?.role === 'admin' && (
          <Link to="/admin" onClick={closeAllMenus} className="hover:text-blue-200">Admin</Link>
        )}

        {user ? (
          <div className="relative">
            <button
              onClick={() => {
                setMenuOpen(!menuOpen);
                setComplaintMenuOpen(false);
              }}
              className="hover:text-blue-200 font-medium"
            >
              {user.name} ▾
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white text-gray-800 rounded shadow-lg py-2 text-sm">
                <Link to="/profile" onClick={closeAllMenus} className="block px-4 py-2 hover:bg-gray-100">
                  My Profile
                </Link>
                <Link to="/my-complaints" onClick={closeAllMenus} className="block px-4 py-2 hover:bg-gray-100">
                  My Complaints
                </Link>
                <Link to="/my-reviews" onClick={closeAllMenus} className="block px-4 py-2 hover:bg-gray-100">
                  My Reviews
                </Link>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" onClick={closeAllMenus} className="hover:text-blue-200">Sign up / Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;