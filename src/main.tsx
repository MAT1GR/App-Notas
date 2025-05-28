import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster 
      position="bottom-right"
      toastOptions={{
        style: {
          background: '#1e293b',
          color: '#e2e8f0',
          borderRadius: '0.375rem',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#e2e8f0',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#e2e8f0',
          },
        },
      }}
    />
  </StrictMode>
);