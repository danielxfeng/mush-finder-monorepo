import '@/index.css';

import * as Sentry from '@sentry/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Outlet, Route, Routes, useLocation } from 'react-router';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { Toaster } from '@/components/ui/sonner';
import { SENTRY_DSN } from '@/constants/constants';
import ErrorBoundary from '@/ErrorBoundary';
import App from '@/Pages/App';
import Species from '@/Pages/Spcies';
import Terms from '@/Pages/Terms';

if (import.meta.env.PRODUCTION && SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    sendDefaultPii: true,
  });
}

/* eslint-disable react-refresh/only-export-components */
const NotFound = () => {
  const location = useLocation();
  throw new Error(`404 Not Found: ${location.pathname}`);
};

/* eslint-disable react-refresh/only-export-components */
const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <Toaster position='top-center' duration={3000} richColors />
    </>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path='/' element={<App />} />
              <Route path='/species' element={<Species />} />
              <Route path='/terms' element={<Terms />} />
            </Route>
            <Route path='*' element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </StrictMode>,
  );
}
