import { apiClient, __setAuthSnapshotProvider } from '../services/apiClient';

beforeEach(() => {
  global.fetch = jest.fn();
  process.env.REACT_APP_API_BASE_URL = 'https://api.example.com';
  __setAuthSnapshotProvider(() => ({ token: 'tok123' }));
});

afterEach(() => {
  jest.resetAllMocks();
});

test('apiClient.get sends auth and audit headers', async () => {
  fetch.mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
  const res = await apiClient.get('/recipes/1', { userId: 'u1', action: 'READ', timestamp: '2023-01-01T00:00:00.000Z' });
  expect(fetch).toHaveBeenCalledWith('https://api.example.com/recipes/1', expect.objectContaining({
    method: 'GET',
    headers: expect.objectContaining({
      'Authorization': 'Bearer tok123',
      'x-user-id': 'u1',
      'x-action': 'READ',
      'x-timestamp': '2023-01-01T00:00:00.000Z'
    })
  }));
  expect(res).toEqual({ ok: true });
});

test('apiClient.post handles error normalization', async () => {
  fetch.mockResolvedValueOnce(new Response(JSON.stringify({ message: 'Bad request' }), { status: 400, headers: { 'Content-Type': 'application/json' } }));
  await expect(apiClient.post('/recommendations', {}, {})).rejects.toThrow('Bad request');
});
