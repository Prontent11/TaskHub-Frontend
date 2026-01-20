import api from './axios';

export const orgLogin = (email: string, password: string) =>
  api.post('/org/auth/login', { email, password });

export const getOrganization = () =>
  api.get('/org/info');

export const createUser = (email: string, password: string, role: string) =>
  api.post('/org/users', { email, password, role });

export const getTasks = () =>
  api.get('/org/tasks');

export const createTask = (title: string, description: string, priority: string, dueDate: string, assignedToId: number | null) =>
  api.post('/org/tasks', { title, description, priority, dueDate, assignedToId });

export const updateTaskStatus = (id: number, status: string) =>
  api.patch(`/org/tasks/${id}/status`, { status });

export const updateTaskDetails = (id: number, data: any) =>
  api.patch(`/org/tasks/${id}`, data);

export const getOrgUsers = () =>
  api.get('/org/users');