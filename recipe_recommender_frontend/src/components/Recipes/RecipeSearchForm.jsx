import React, { useState } from 'react';
import { apiClient } from '../../services/apiClient';
import { auditClient } from '../../services/auditClient';
import { useAuth } from '../../context/AuthContext';

/**
 * Validate search fields on client side with friendly errors.
 * - Ingredients text required; max length 500
 * - Max time numeric, positive, <= 600
 * - Dietary preferences and cuisine optional with whitelists (basic)
 */
const DIETARY_OPTIONS = ['vegan', 'vegetarian', 'gluten-free', 'keto', 'paleo', 'none'];
const CUISINE_OPTIONS = ['any', 'italian', 'indian', 'mexican', 'chinese', 'thai', 'french', 'american', 'mediterranean'];

/**
 * PUBLIC_INTERFACE
 * Form to capture recipe search inputs with validation and audit trail.
 * @component RecipeSearchForm
 * @param {Object} props
 * @param {Function} props.onResults - callback when successful results return.
 * @param {Function} [props.onError] - callback when error occurs.
 */
export default function RecipeSearchForm({ onResults, onError }) {
  const { user } = useAuth();
  const [ingredients, setIngredients] = useState('');
  const [dietary, setDietary] = useState('none');
  const [cuisine, setCuisine] = useState('any');
  const [maxTime, setMaxTime] = useState('');
  const [errors, setErrors] = useState({});

  const buildMetadata = (action) => ({
    userId: user?.id || 'anonymous',
    action,
    timestamp: new Date().toISOString(),
  });

  const validate = () => {
    const e = {};
    const trimmed = ingredients.trim();
    if (!trimmed) e.ingredients = 'Please enter at least one ingredient.';
    if (trimmed.length > 500) e.ingredients = 'Ingredients text is too long (max 500).';
    if (dietary && !DIETARY_OPTIONS.includes(dietary)) e.dietary = 'Invalid dietary selection.';
    if (cuisine && !CUISINE_OPTIONS.includes(cuisine)) e.cuisine = 'Invalid cuisine selection.';
    if (maxTime) {
      const n = Number(maxTime);
      if (Number.isNaN(n) || n <= 0) e.maxTime = 'Max time must be a positive number.';
      if (n > 600) e.maxTime = 'Max time must be 600 minutes or less.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ingredients,
      preferences: dietary === 'none' ? [] : [dietary],
      cuisine: cuisine === 'any' ? null : cuisine,
      maxTime: maxTime ? Number(maxTime) : null,
      page: 0,
      size: 10,
      sort: 'relevance',
      metadata: buildMetadata('READ'),
    };

    try {
      // audit: frontend emits audit event alongside API request
      await auditClient.emit({
        ...payload.metadata,
        event: 'search_submit',
        details: {
          hasMaxTime: !!payload.maxTime,
          cuisine: payload.cuisine || 'any',
          preferences: payload.preferences,
        }
      });

      const res = await apiClient.post('/recommendations', payload, {
        action: 'READ',
        userId: payload.metadata.userId,
        timestamp: payload.metadata.timestamp
      });

      if (res && res.items) {
        onResults?.(res);
      } else {
        onResults?.({ items: [], page: 0, size: 10, total: 0 });
      }
    } catch (err) {
      onError?.(err);
    }
  };

  return (
    <form onSubmit={onSubmit} aria-label="Recipe search form" style={{
      display: 'grid', gap: 12, backgroundColor: 'var(--bg-secondary)',
      padding: 16, borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
    }}>
      <div>
        <label htmlFor="ingredients" style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Ingredients</label>
        <textarea
          id="ingredients"
          name="ingredients"
          rows={3}
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="e.g., chicken, garlic, lemon"
          aria-invalid={!!errors.ingredients}
          aria-describedby={errors.ingredients ? 'ingredients-error' : undefined}
          style={{
            width: '100%',
            padding: 10,
            borderRadius: 8,
            border: `1px solid ${errors.ingredients ? 'rgba(239,68,68,0.5)' : 'rgba(17,24,39,0.15)'}`,
            outline: 'none'
          }}
        />
        {errors.ingredients && <div id="ingredients-error" style={{ color: '#EF4444', fontSize: 12 }}>{errors.ingredients}</div>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label htmlFor="dietary" style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Dietary preference</label>
          <select
            id="dietary"
            name="dietary"
            value={dietary}
            onChange={(e) => setDietary(e.target.value)}
            aria-invalid={!!errors.dietary}
            style={{
              width: '100%',
              padding: 10,
              borderRadius: 8,
              border: `1px solid ${errors.dietary ? 'rgba(239,68,68,0.5)' : 'rgba(17,24,39,0.15)'}`,
              outline: 'none'
            }}
          >
            {DIETARY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          {errors.dietary && <div style={{ color: '#EF4444', fontSize: 12 }}>{errors.dietary}</div>}
        </div>

        <div>
          <label htmlFor="cuisine" style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Cuisine</label>
          <select
            id="cuisine"
            name="cuisine"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            aria-invalid={!!errors.cuisine}
            style={{
              width: '100%',
              padding: 10,
              borderRadius: 8,
              border: `1px solid ${errors.cuisine ? 'rgba(239,68,68,0.5)' : 'rgba(17,24,39,0.15)'}`,
              outline: 'none'
            }}
          >
            {CUISINE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          {errors.cuisine && <div style={{ color: '#EF4444', fontSize: 12 }}>{errors.cuisine}</div>}
        </div>
      </div>

      <div>
        <label htmlFor="maxTime" style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Max time (minutes)</label>
        <input
          id="maxTime"
          name="maxTime"
          type="number"
          min={1}
          max={600}
          placeholder="Optional"
          value={maxTime}
          onChange={(e) => setMaxTime(e.target.value)}
          aria-invalid={!!errors.maxTime}
          aria-describedby={errors.maxTime ? 'maxTime-error' : undefined}
          style={{
            width: '100%',
            padding: 10,
            borderRadius: 8,
            border: `1px solid ${errors.maxTime ? 'rgba(239,68,68,0.5)' : 'rgba(17,24,39,0.15)'}`,
            outline: 'none'
          }}
        />
        {errors.maxTime && <div id="maxTime-error" style={{ color: '#EF4444', fontSize: 12 }}>{errors.maxTime}</div>}
      </div>

      <div>
        <button
          type="submit"
          style={{
            padding: '10px 14px',
            backgroundColor: '#2563EB',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontWeight: 600,
            boxShadow: '0 2px 6px rgba(37,99,235,0.25)'
          }}
        >
          Search recipes
        </button>
      </div>
    </form>
  );
}
