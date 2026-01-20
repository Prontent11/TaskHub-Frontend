import { useLocation, useNavigate } from 'react-router-dom';

export default function SuperAdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="space-y-1">
      <div className="px-4 py-3 mb-4 rounded-lg bg-purple-50 border border-purple-200">
        <p className="text-xs text-gray-600 uppercase tracking-wide">Admin Panel</p>
        <p className="text-lg font-bold text-purple-900">👑 Super Admin</p>
      </div>

      <a 
        href="/super-admin/organizations"
        className={`block px-4 py-3 rounded-lg transition-all font-medium ${
          isActive('/super-admin/organizations') 
            ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-600' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        🏢 Organizations
      </a>

      <hr className="my-4 border-gray-200" />

      <button
        className="w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all font-medium flex items-center"
        onClick={() => {
          localStorage.clear();
          navigate('/');
        }}
      >
        🚪 Logout
      </button>
    </nav>
  );
}
