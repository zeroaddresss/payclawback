import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ErrorBoundary from './components/ErrorBoundary';

const Landing = lazy(() => import('./pages/Landing'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Docs = lazy(() => import('./pages/Docs'));

export default function App() {
  const { pathname } = useLocation();
  const isLanding = pathname === '/';

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen flex-col">
        {!isLanding && <Header />}
        <main className={isLanding ? 'flex-1' : 'flex-1 pt-16'}>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </Suspense>
        </main>
        {!isLanding && <Footer />}
      </div>
    </ErrorBoundary>
  );
}
