// api.js
// Use .env variable for API base URL with fallback
const API = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

console.log("API BASE URL:", API);

/**
 * Generic request function
 * @param {string} path - endpoint path (e.g., '/auth/login')
 * @param {object} options - fetch options (method, body, headers)
 * @param {string} token - JWT token for Authorization header
 * @returns {Promise<object>} - response data or error
 */
async function request(path, options = {}, token) {
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: 'Bearer ' + token } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(API + path, { ...options, headers });
    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text; // fallback in case response is not JSON
    }

    if (!res.ok) {
      throw new Error(data?.msg || `Request failed with status ${res.status}`);
    }

    return data;
  } catch (err) {
    console.error('API Error:', err);
    return { error: err.message };
  }
}

// ==============================
// API helper functions
// ==============================

export async function apiPost(path, body, token) {
  return request(path, { method: 'POST', body: JSON.stringify(body) }, token);
}

export async function apiGet(path, token) {
  return request(path, { method: 'GET' }, token);
}

export async function apiPut(path, body, token) {
  return request(path, { method: 'PUT', body: JSON.stringify(body) }, token);
}

export async function apiDelete(path, token) {
  return request(path, { method: 'DELETE' }, token);
}
