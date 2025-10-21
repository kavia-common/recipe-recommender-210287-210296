import { getAuthContextSnapshot } from './internalAuthSnapshot';

/**
 * PUBLIC_INTERFACE
 * auditClient - sends audit events to external audit API.
 * Requires REACT_APP_AUDIT_API_BASE_URL.
 * Event payload: { userId, action, timestamp, event, details }
 */
export const auditClient = {
  /**
   * PUBLIC_INTERFACE
   * Emit an audit event (non-blocking errors are swallowed).
   * @param {{userId:string, action:string, timestamp:string, event:string, details?:any}} event
   * @returns {Promise<void>}
   */
  async emit(event) {
    const base = process.env.REACT_APP_AUDIT_API_BASE_URL;
    if (!base) {
      // silently ignore if audit URL not provided (configurable per environment)
      return;
    }
    const url = base.replace(/\/+$/, '') + '/audit';
    const { token } = getAuthContextSnapshot();

    try {
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(event),
      });
    } catch {
      // non-blocking
    }
  }
};
