let _provider = null;

/**
 * PUBLIC_INTERFACE
 * Register a provider that returns { token: string|null }
 * Used by AuthProvider to allow services to read token.
 * @param {function(): {token: string|null}} fn
 */
export function registerAuthSnapshotProvider(fn) {
  _provider = fn;
}

/**
 * PUBLIC_INTERFACE
 * Get current auth snapshot
 * @returns {{token: string|null}}
 */
export function getAuthContextSnapshot() {
  return _provider ? _provider() : { token: null };
}
