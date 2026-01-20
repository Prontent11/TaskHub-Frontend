import { Navigate } from 'react-router-dom';
import { getTokenPayload } from './auth';
import type { JSX } from 'react';

export default function ProtectedRoute({
  children,
  type,
  role,
}: {
  children: JSX.Element;
  type: 'SUPER_ADMIN' | 'ORG_USER';
  role?: string;
}) {
  const payload = getTokenPayload();

  if (!payload) return <Navigate to="/" />;
  if (payload.type !== type) return <Navigate to="/" />;
  if (role && payload.role !== role) return <Navigate to="/" />;

  return children;
}
