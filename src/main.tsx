import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('email-marketing-niches-root');
  
  if (rootElement) {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  }
});