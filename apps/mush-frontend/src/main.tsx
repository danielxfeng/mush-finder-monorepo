import '@/index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Outlet, Route, Routes, useLocation } from 'react-router';

import App from '@/App.tsx';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ErrorBoundary from '@/ErrorBoundary';

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
            </Route>
            <Route path='*' element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </StrictMode>,
  );
}
