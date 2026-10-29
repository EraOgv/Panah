import { Link, Outlet, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Overview', path: '/admin' },
  { label: 'Complaints', path: '/admin/complaints' },
  { label: 'Users', path: '/admin/users' },
  { label: 'Flagged Content', path: '/admin/flagged' },
  { label: 'Hotspots', path: '/admin/hotspots' },
];

function AdminLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-56 bg-white border-r min-h-screen px-4 py-6">
        <h2 className="text-lg font-bold text-blue-700 mb-6 px-2">Admin Panel</h2>
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-3 py-2 rounded text-sm font-medium ${
                location.pathname === item.path
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;