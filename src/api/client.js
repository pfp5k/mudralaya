const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const DASHBOARD_API_KEY = import.meta.env.VITE_DASHBOARD_API_KEY || '';

const buildUrl = (path) => {
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`;
};

async function request(path, { method = 'GET', data, headers = {}, includeCredentials = false } = {}) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    credentials: includeCredentials ? 'include' : 'same-origin'
  };

  if (data !== undefined) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(buildUrl(path), options);
  let body = null;
  try {
    body = await response.json();
  } catch (err) {
    body = null;
  }

  if (!response.ok) {
    const error = new Error(body?.error || 'Request failed');
    error.status = response.status;
    error.data = body;
    throw error;
  }

  return body;
}

export { request, API_BASE_URL, DASHBOARD_API_KEY };
