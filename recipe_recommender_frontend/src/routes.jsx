import React, { useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Topbar from './components/Layout/Topbar';
import Sidebar from './components/Layout/Sidebar';
import RecipeSearchForm from './components/Recipes/RecipeSearchForm';
import RecipeList from './components/Recipes/RecipeList';
import RecipeDetail from './components/Recipes/RecipeDetail';
import ErrorBanner from './components/Common/ErrorBanner';
import { useTheme } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';

/**
 * Simple Saved page (protected) placeholder.
 */
function SavedPage() {
  return <div>Saved recipes will appear here (protected).</div>;
}

/**
 * PUBLIC_INTERFACE
 * AppRoutes - orchestrates layout and views.
 */
export default function AppRoutes() {
  const { theme, toggleTheme } = useTheme();
  const [results, setResults] = useState(null);
  const [lastQuery, setLastQuery] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const mainStyle = useMemo(() => ({
    display: 'grid',
    gridTemplateColumns: '220px 1fr',
    minHeight: '100vh',
    backgroundColor: 'var(--bg-primary)'
  }), []);

  return (
    <BrowserRouter>
      <Topbar theme={theme} onToggleTheme={toggleTheme} />
      <div style={mainStyle}>
        <Sidebar />
        <main role="main" style={{ padding: 16, display: 'grid', gap: 16 }}>
          {error && <ErrorBanner message={error} onRetry={() => setError(null)} />}
          <Routes>
            <Route path="/" element={
              <div style={{ display: 'grid', gap: 16 }}>
                <RecipeSearchForm
                  onResults={(res) => { setResults(res); setLastQuery(res?._query || lastQuery); }}
                  onError={(err) => setError(err?.message || 'Search failed')}
                />
                {results && <RecipeList query={lastQuery || {}} />}
              </div>
            } />
            <Route path="/recipes" element={
              <div>
                <RecipeSearchForm
                  onResults={(res) => { setResults(res); setLastQuery(res?._query || lastQuery); }}
                  onError={(err) => setError(err?.message || 'Search failed')}
                />
                {results && <RecipeList query={lastQuery || {}} />}
              </div>
            } />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/saved" element={user ? <SavedPage /> : <Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
