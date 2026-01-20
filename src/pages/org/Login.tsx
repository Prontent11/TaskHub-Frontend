import { useState } from 'react';
import { orgLogin } from '../../api/org.api';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const Navigate=useNavigate();
  async function submit() {
    try {
      setLoading(true);
      setError('');
      const res = await orgLogin(email, password);
      localStorage.setItem('token', res.data.token);
       Navigate('/org/tasks');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Organization Login</h1>
        <p className="text-center text-gray-600 mb-6">Access your organization dashboard</p>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <Input
          label="Email Address"
          type="email"
          placeholder="user@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <Button onClick={submit} disabled={loading} className="w-full">
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>

        <p className="text-center text-gray-600 text-sm mt-4">
          New user? <a href="/">Sign up with super admin</a>
        </p>
      </div>
    </div>
  );
}
