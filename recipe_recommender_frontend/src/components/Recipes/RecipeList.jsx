import React, { useEffect, useState } from 'react';
import { apiClient } from '../../services/apiClient';
import { useAuth } from '../../context/AuthContext';
import Loading from '../Common/Loading';
import ErrorBanner from '../Common/ErrorBanner';
import { Link } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * RecipeList displays list of recipes with pagination and sorting.
 * Fetches using apiClient and includes audit metadata headers.
 *
 * @component RecipeList
 * @param {object} props
 * @param {object} props.query - Search params payload (ingredients, preferences, cuisine, maxTime, page, size, sort)
 */
export default function RecipeList({ query }) {
  const { user } = useAuth();
  const [state, setState] = useState({ loading: false, error: null, data: { items: [], page: 0, size: 10, total: 0 } });
  const [page, setPage] = useState(query?.page || 0);
  const [sort, setSort] = useState(query?.sort || 'relevance');

  const metadata = {
    userId: user?.id || 'anonymous',
    action: 'READ',
    timestamp: new Date().toISOString()
  };

  const fetchData = async () => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const payload = { ...query, page, sort, metadata };
      const res = await apiClient.post('/recommendations', payload, metadata);
      setState({ loading: false, error: null, data: res || { items: [], page, size: query?.size || 10, total: 0 } });
    } catch (err) {
      setState(s => ({ ...s, loading: false, error: err?.message || 'Failed to load recipes' }));
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sort, JSON.stringify(query)]);

  const totalPages = Math.max(1, Math.ceil((state.data?.total || 0) / (state.data?.size || 10)));

  return (
    <section aria-label="Recipe list" style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong style={{ color: '#111827' }}>
          Results {state.data?.total ? `(${state.data.total})` : ''}
        </strong>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: '#374151' }}>Sort by</span>
          <select
            aria-label="Sort by"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid rgba(17,24,39,0.15)' }}
          >
            <option value="relevance">Relevance</option>
            <option value="prepTime">Prep Time</option>
            <option value="title">Title</option>
          </select>
        </label>
      </div>

      {state.loading && <Loading label="Loading recipes" />}
      {state.error && <ErrorBanner message={state.error} onRetry={fetchData} />}

      {!state.loading && !state.error && (
        <>
          <ul style={{
            listStyle: 'none', margin: 0, padding: 0,
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12
          }}>
            {state.data.items?.map(item => (
              <li key={item.id} style={{
                border: '1px solid rgba(17,24,39,0.08)',
                borderRadius: 12,
                padding: 12,
                backgroundColor: '#fff',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
              }}>
                <div style={{ fontWeight: 700, color: '#111827', marginBottom: 6 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 10 }}>
                  {item.prepTime ? `${item.prepTime} min` : 'N/A'}
                </div>
                <Link
                  to={`/recipe/${encodeURIComponent(item.id)}`}
                  style={{
                    display: 'inline-block',
                    padding: '8px 10px',
                    backgroundColor: '#2563EB',
                    color: '#fff',
                    borderRadius: 8,
                    textDecoration: 'none',
                    fontSize: 14
                  }}
                >
                  View details
                </Link>
              </li>
            ))}
          </ul>

          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 8 }}>
            <button
              disabled={page <= 0}
              onClick={() => setPage(p => Math.max(0, p - 1))}
              style={{
                padding: '8px 10px',
                backgroundColor: page <= 0 ? 'rgba(17,24,39,0.1)' : '#F59E0B',
                color: '#111827',
                border: 'none',
                borderRadius: 8,
                cursor: page <= 0 ? 'not-allowed' : 'pointer'
              }}
            >
              Prev
            </button>
            <div aria-live="polite" style={{ padding: '8px 10px' }}>
              Page {page + 1} / {totalPages}
            </div>
            <button
              disabled={page + 1 >= totalPages}
              onClick={() => setPage(p => p + 1)}
              style={{
                padding: '8px 10px',
                backgroundColor: page + 1 >= totalPages ? 'rgba(17,24,39,0.1)' : '#F59E0B',
                color: '#111827',
                border: 'none',
                borderRadius: 8,
                cursor: page + 1 >= totalPages ? 'not-allowed' : 'pointer'
              }}
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}
