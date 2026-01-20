export function getTokenPayload() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  return JSON.parse(atob(token.split('.')[1]));
}

export function logout() {
  localStorage.removeItem('token');
  window.location.href = '/';
}

export function getCurrentUser() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  return JSON.parse(atob(token.split('.')[1]));
}
