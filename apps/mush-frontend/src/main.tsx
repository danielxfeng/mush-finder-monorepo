import '@/index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router';

import App from '@/App.tsx';
import ErrorBoundary from '@/ErrorBoundary';

/* eslint-disable react-refresh/only-export-components */
const NotFound = () => {
  const location = useLocation();
  throw new Error(`404 Not Found: ${location.pathname}`);
};

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route path='/' element={<App />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </StrictMode>,
  );
}
