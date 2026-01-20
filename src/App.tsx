import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './auth/ProtectedRoute';

import SuperLogin from './pages/superAdmin/Login';
import Orgs from './pages/superAdmin/Organizations';
import OrgLogin from './pages/org/Login';
import Tasks from './pages/org/Tasks';
import Users from './pages/org/Users';
import Test from './pages/Test';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SuperLogin />} />
        <Route path="/test" element={<Test/>} />
        <Route path="/org/login" element={<OrgLogin />} />
        <Route path="/super-admin/orgs" element={
          <ProtectedRoute type="SUPER_ADMIN">
            <Orgs />
          </ProtectedRoute>
        } />

        <Route path="/org/tasks" element={
          <ProtectedRoute type="ORG_USER">
            <Tasks />
          </ProtectedRoute>
        } />

        <Route path="/org/users" element={
          <ProtectedRoute type="ORG_USER" role="ADMIN">
            <Users />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}
