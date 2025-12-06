import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './assets/styles/global.css';
import App from './router';
import ErrorBoundary from './components/common/ErrorBoundary';
import { Toaster } from "@/components/ui/toaster"

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <ErrorBoundary>
      <App />
      <Toaster />
    </ErrorBoundary>
  </StrictMode>
);
