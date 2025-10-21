/**
 * PUBLIC_INTERFACE
 * apiClient - Minimal fetch wrapper with:
 * - Base URL from REACT_APP_API_BASE_URL
 * - Auth token header if available
 * - Audit metadata headers (x-user-id, x-action, x-timestamp) when provided
 * - Normalized error handling
 */
export const apiClient = {
  /**
   * PUBLIC_INTERFACE
   * Perform GET request.
   * @param {string} path
   * @param {{userId?:string, action?:string, timestamp?:string}} [meta]
   * @returns {Promise<any>}
   */
  async get(path, meta = {}) {
    const base = process.env.REACT_APP_API_BASE_URL;
    if (!base) throw new Error('Missing REACT_APP_API_BASE_URL');
    const url = base.replace(/\/+$/, '') + path;

    const { token } = getAuthContextSnapshot();
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...(meta.userId ? { 'x-user-id': meta.userId } : {}),
        ...(meta.action ? { 'x-action': meta.action } : {}),
        ...(meta.timestamp ? { 'x-timestamp': meta.timestamp } : {}),
      },
    });
    return handleResponse(res);
  },

  /**
   * PUBLIC_INTERFACE
   * Perform POST request with JSON body.
   * @param {string} path
   * @param {any} body
   * @param {{userId?:string, action?:string, timestamp?:string}} [meta]
   * @returns {Promise<any>}
   */
  async post(path, body, meta = {}) {
    const base = process.env.REACT_APP_API_BASE_URL;
    if (!base) throw new Error('Missing REACT_APP_API_BASE_URL');
    const url = base.replace(/\/+$/, '') + path;

    const { token } = getAuthContextSnapshot();
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...(meta.userId ? { 'x-user-id': meta.userId } : {}),
        ...(meta.action ? { 'x-action': meta.action } : {}),
        ...(meta.timestamp ? { 'x-timestamp': meta.timestamp } : {}),
      },
      body: JSON.stringify(body ?? {}),
    });
    return handleResponse(res);
  },
};

/**
 * Normalize fetch response and throw user-friendly errors.
 * @param {Response} res
 * @returns {Promise<any>}
 */
async function handleResponse(res) {
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const data = isJson ? await res.json() : await res.text();
      if (data?.message) message = data.message;
    } catch {
      // ignore parse errors
    }
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  return isJson ? res.json() : res.text();
}

// INTERNAL: lightweight access to auth token without hook (for services)
let _authSnapshotProvider = null;

/**
 * PUBLIC_INTERFACE
 * INTERNAL ONLY: Set a snapshot provider that returns { token }
 * Used by AuthProvider injection to avoid cyclic imports in tests.
 * @param {function(): {token: string|null}} fn
 */
export function __setAuthSnapshotProvider(fn) {
  _authSnapshotProvider = fn;
}

/**
 * Return auth snapshot with token; defaults to null token.
 * @returns {{token: string|null}}
 */
function getAuthContextSnapshotDefault() { return { token: null }; }

/**
 * PUBLIC_INTERFACE
 * Get current auth context snapshot for services.
 * @returns {{token: string|null}}
 */
export function getAuthContextSnapshot() {
  return _authSnapshotProvider ? _authSnapshotProvider() : getAuthContextSnapshotDefault();
}
