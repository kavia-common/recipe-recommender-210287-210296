import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from '../../services/apiClient';
import { auditClient } from '../../services/auditClient';
import { useAuth } from '../../context/AuthContext';
import Loading from '../Common/Loading';
import ErrorBanner from '../Common/ErrorBanner';

/**
 * PUBLIC_INTERFACE
 * RecipeDetail fetches and displays a single recipe details by ID.
 * Includes audit metadata for view event.
 *
 * @component RecipeDetail
 */
export default function RecipeDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [state, setState] = useState({ loading: true, error: null, recipe: null });

  useEffect(() => {
    const metadata = {
      userId: user?.id || 'anonymous',
      action: 'READ',
      timestamp: new Date().toISOString(),
    };

    const run = async () => {
      setState({ loading: true, error: null, recipe: null });
      try {
        await auditClient.emit({
          ...metadata,
          event: 'recipe_view',
          details: { recipeId: id }
        });

        const res = await apiClient.get(`/recipes/${encodeURIComponent(id)}`, metadata);
        setState({ loading: false, error: null, recipe: res });
      } catch (err) {
        setState({ loading: false, error: err?.message || 'Failed to load recipe', recipe: null });
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (state.loading) return <Loading label="Loading recipe" />;
  if (state.error) return <ErrorBanner message={state.error} onRetry={() => window.location.reload()} />;

  const r = state.recipe || {};
  return (
    <article aria-label="Recipe detail" style={{ display: 'grid', gap: 12 }}>
      <h2 style={{ margin: 0, color: '#111827' }}>{r.title || 'Untitled'}</h2>
      <div style={{ color: '#6B7280', fontSize: 14 }}>
        Prep time: {r.prepTime ? `${r.prepTime} min` : 'N/A'}
      </div>
      <section>
        <h3>Ingredients</h3>
        <ul>
          {(r.ingredients || []).map((it, i) => <li key={i}>{it}</li>)}
        </ul>
      </section>
      <section>
        <h3>Steps</h3>
        <ol>
          {(r.steps || []).map((it, i) => <li key={i}>{it}</li>)}
        </ol>
      </section>
      {r.nutrition && (
        <section>
          <h3>Nutrition</h3>
          <pre style={{ background: '#F3F4F6', padding: 12, borderRadius: 8, overflow: 'auto' }}>
            {JSON.stringify(r.nutrition, null, 2)}
          </pre>
        </section>
      )}
    </article>
  );
}
