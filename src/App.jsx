import React, { useState, useEffect, lazy, Suspense } from 'react';
import { DataProvider } from './context/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SmoothScrollProvider } from './hooks/useSmoothScroll';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Preloader } from './components/common/Preloader';

// Lazy loaded pages
const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const ServiceDetails = lazy(() =>
  import('./pages/ServiceDetails').then((m) => ({ default: m.ServiceDetails }))
);
const LegalPage = lazy(() => import('./pages/LegalPage').then((m) => ({ default: m.LegalPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const DashboardPage = lazy(() =>
  import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

function ProtectedDashboard() {
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading && !session) {
      window.location.replace('/dashboard/login');
    }
  }, [loading, session]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-950 text-sm tracking-widest text-cream/60 uppercase">
        Checking session…
      </div>
    );
  }

  return session ? (
    <Suspense fallback={null}>
      <DashboardPage />
    </Suspense>
  ) : null;
}

function MainRouter() {
  const [pathname, setPathname] = useState(() => window.location.pathname);
  const [preloaderDone, setPreloaderDone] = useState(false);

  useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Determine current page route
  const getRoute = () => {
    const p = pathname.replace(/\/$/, '') || '/';
    if (p === '/' || p === '/index.html') return { type: 'home' };
    if (p === '/privacy-policy') return { type: 'privacy' };
    if (p === '/terms-of-service') return { type: 'terms' };
    if (p === '/dashboard/login') return { type: 'login' };
    if (p === '/dashboard') return { type: 'dashboard' };
    if (p.startsWith('/services/')) {
      const id = p.split('/services/')[1];
      return { type: 'service', id };
    }
    return { type: 'notfound' };
  };

  const route = getRoute();

  if (route.type === 'home' && !preloaderDone) {
    return <Preloader onFinish={() => setPreloaderDone(true)} />;
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-navy-950" />}>
      {route.type === 'home' && (
        <SmoothScrollProvider>
          <HomePage />
        </SmoothScrollProvider>
      )}
      {route.type === 'service' && <ServiceDetails serviceId={route.id} />}
      {route.type === 'privacy' && <LegalPage slug="privacy-policy" />}
      {route.type === 'terms' && <LegalPage slug="terms-of-service" />}
      {route.type === 'login' && <LoginPage />}
      {route.type === 'dashboard' && <ProtectedDashboard />}
      {route.type === 'notfound' && <NotFoundPage />}
    </Suspense>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <DataProvider>
          <MainRouter />
        </DataProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
