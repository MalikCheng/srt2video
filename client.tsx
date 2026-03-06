// Client-Side Hydration
import React from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');

if (container.hasChildNodes()) {
  // Hydrate existing SSR content
  hydrateRoot(container, <App />);
} else {
  // Full client-side render
  createRoot(container).render(<App />);
}
