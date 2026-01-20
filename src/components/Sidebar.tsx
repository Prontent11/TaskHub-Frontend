import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../auth/auth';
import { useState, useEffect } from 'react';
import { getOrganization } from '../api/org.api';

export default function Sidebar() {
  const user = getCurrentUser();
  const location = useLocation();
  const Navigate = useNavigate();
  const [orgName, setOrgName] = useState('');
  
  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const loadOrg = async () => {
      try {
        const res = await getOrganization();
        setOrgName(res.data?.name || '');
      } catch (err) {
        // Silently fail if unable to load organization
      }
    };
    
    if (user?.type === 'ORG_USER') {
      loadOrg();
    }
  }, [user]);
 
  return (
    <nav className="space-y-1">
      {orgName && (
        <div className="px-4 py-3 mb-4 rounded-lg bg-blue-50 border border-blue-200">
          <p className="text-xs text-gray-600 uppercase tracking-wide">Organization</p>
          <p className="text-lg font-bold text-blue-900">🏢 {orgName}</p>
        </div>
      )}

      <Link 
        className={`block px-4 py-3 rounded-lg transition-all font-medium ${
          isActive('/org/tasks') 
            ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-600' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        to="/org/tasks"
      >
        📋 Tasks
      </Link>

      {(user.role === 'ADMIN') && (
        <Link 
          className={`block px-4 py-3 rounded-lg transition-all font-medium ${
            isActive('/org/users') 
              ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-600' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          to="/org/users"
        >
          👥 Users
        </Link>
      )}

      <hr className="my-4 border-gray-200" />

      <button
        className="w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all font-medium flex items-center"
        onClick={() => {
          localStorage.clear();
          if(window.location.pathname.startsWith('/org')) {
            Navigate('/org/login');
          }
          else {
            Navigate('/');
          }
        }}
      >
        🚪 Logout
      </button>
    </nav>
  );
}
