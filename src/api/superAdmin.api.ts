import api from './axios';

export const superAdminLogin = (email: string, password: string) =>
  api.post('/super-admin/auth/login', { email, password });

export const getOrganizations = () =>
  api.get('/super-admin/organizations');

export const createOrganization = (name: string) =>
  api.post('/super-admin/organizations', { name });

export const createOrgAdmin = (
  orgId: number,
  email: string,
  password: string
) =>
  api.post(`/super-admin/organizations/${orgId}/admin`, {
    email,
    password,
  });

export const updateOrganizationStatus = (orgId: number, status: string) =>
  api.patch(`/super-admin/organizations/${orgId}/status`, { status });
