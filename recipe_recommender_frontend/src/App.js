import React, { useEffect } from 'react';
import './App.css';
import AppRoutes from './routes';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { registerAuthSnapshotProvider } from './services/internalAuthSnapshot';

/**
 * PUBLIC_INTERFACE
 * App root wraps providers and routes.
 */
function App() {
  // Inject snapshot provider so services can read token without hooks
  useEffect(() => {
    registerAuthSnapshotProvider(() => {
      try {
        const raw = sessionStorage.getItem('rr_auth');
        if (!raw) return { token: null };
        const parsed = JSON.parse(raw);
        return { token: parsed?.token || null };
      } catch {
        return { token: null };
      }
    });
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider>
        <div className="App">
          <AppRoutes />
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
