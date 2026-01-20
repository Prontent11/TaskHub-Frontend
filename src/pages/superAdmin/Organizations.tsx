import { useEffect, useState } from 'react';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import AppLayout from '../../layout/AppLayout';
import SuperAdminSidebar from '../../components/SuperAdminSidebar';
import {
  createOrganization,
  getOrganizations,
  createOrgAdmin,
  updateOrganizationStatus,
} from '../../api/superAdmin.api';

export default function Organizations() {
  const [orgs, setOrgs] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [selectedOrg, setSelectedOrg] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function load() {
    try {
      setError('');
      const res = await getOrganizations();
      setOrgs(res.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load organizations');
    }
  }

  async function createOrg() {
    if (!name.trim()) {
      setError('Organization name is required');
      return;
    }
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await createOrganization(name);
      setName('');
      setSuccess('Organization created successfully!');
      setTimeout(() => setSuccess(''), 3000);
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create organization');
    } finally {
      setLoading(false);
    }
  }

  async function createAdmin() {
    if (!selectedOrg || !email.trim() || !password.trim()) {
      setError('Email and password are required');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await createOrgAdmin(selectedOrg, email, password);
      setEmail('');
      setPassword('');
      setSuccess(`Admin created for ${email}`);
      setTimeout(() => setSuccess(''), 3000);
      setSelectedOrg(null);
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create admin');
    } finally {
      setLoading(false);
    }
  }

  async function toggleOrgStatus(orgId: number, currentStatus: string) {
    const newStatus = currentStatus === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    try {
      setError('');
      await updateOrganizationStatus(orgId, newStatus);
      setSuccess(`Organization ${newStatus === 'ACTIVE' ? 'enabled' : 'disabled'} successfully!`);
      setTimeout(() => setSuccess(''), 3000);
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update organization status');
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <AppLayout sidebar={<SuperAdminSidebar />}>
      <div className="max-w-6xl mx-auto">
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
          {/* Create Organization Section */}
          <Card className="lg:col-span-1 sticky top-24 h-fit">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🏢 Create Organization</h3>
            <Input
              label="Organization Name"
              placeholder="Acme Corp"
              value={name}
              onChange={(e: any) => setName(e.target.value)}
            />
            <Button onClick={createOrg} disabled={loading} className="w-full">
              {loading ? 'Creating...' : 'Create Organization'}
            </Button>
          </Card>

          {/* Organizations List */}
          <Card className="lg:col-span-2">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Organizations ({orgs.length})</h3>
            {orgs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">🏢 No organizations yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orgs.map((o) => (
                  <div key={o.id} className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all">
                    <div>
                      <p className="font-medium text-gray-900">{o.name}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${o.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {o.status === 'ACTIVE' ? '✅ Active' : '🔒 Disabled'}
                        </span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => setSelectedOrg(o.id)}
                      >
                        👑 Admin
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => toggleOrgStatus(o.id, o.status)}
                        className={o.status === 'ACTIVE' ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}
                      >
                        {o.status === 'ACTIVE' ? '⏸️ Disable' : '✅ Enable'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Create Admin Section */}
        {selectedOrg && (
          <Card className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">👑 Create Organization Admin</h3>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => setSelectedOrg(null)}
              >
                Cancel
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Email Address"
                type="email"
                placeholder="admin@organization.com" 
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
            </div>
            
            <div className="mt-4 flex gap-3">
              <Button onClick={createAdmin} disabled={loading} className="flex-1">
                {loading ? 'Creating...' : 'Create Admin'}
              </Button>
              <Button 
                variant="secondary"
                onClick={() => setSelectedOrg(null)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
