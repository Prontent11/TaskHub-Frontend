import { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import AppLayout from '../../layout/AppLayout';
import Sidebar from '../../components/Sidebar';
import { createUser, getOrgUsers } from '../../api/org.api';

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function load() {
    try {
      setError('');
      const res = await getOrgUsers();
      setUsers(res.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load users');
    }
  }

  async function submit() {
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required');
      return;
    }
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await createUser(email, password, role);
      setEmail('');
      setPassword('');
      setRole('USER');
      setSuccess('User created successfully!');    
      setTimeout(() => setSuccess(''), 3000);
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const getRoleBadgeColor = (role: string) => {
    switch(role) {
      case 'ADMIN': return 'bg-red-100 text-red-800';
      case 'MANAGER': return 'bg-blue-100 text-blue-800';
      case 'USER': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch(role) {
      case 'ADMIN': return '👑';
      case 'MANAGER': return '📋';
      case 'USER': return '👤';
      default: return '👤';
    }
  };

  return (
    <AppLayout sidebar={<Sidebar />}>
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create User Section */}
          <Card className="lg:col-span-1 sticky top-24 h-fit">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Create User</h3>
            <Input
              label="Email Address"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e:any)=>setEmail(e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e:any)=>setPassword(e.target.value)}
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select 
                className="form-select"
                value={role}
                onChange={(e)=>setRole(e.target.value)}
              >
                <option value="ADMIN">👑 Admin</option>
                <option value="MANAGER">📋 Manager</option>
                <option value="USER">👤 User</option>
              </select>
            </div>

            <Button onClick={submit} disabled={loading} className="w-full">
              {loading ? 'Creating...' : 'Create User'}
            </Button>
          </Card>

          {/* Users List */}
          <Card className="lg:col-span-2">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Organization Users ({users.length})</h3>
            {users.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">👥 No users yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {users.map(u => (
                  <div key={u.id} className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg">
                        {getRoleIcon(u.role)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{u.email}</p>
                        <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(u.role)}`}>
                          {u.role}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 bg-green-50 px-3 py-1 rounded-full font-medium">✓ Active</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
