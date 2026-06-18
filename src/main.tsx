import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Legacy design system carried over from V1 (global, class-based).
import './styles/reset.css';
import './styles/style.css';
import './styles/nav.css';
import './styles/portfolio.css';
import './styles/services.css';
import './styles/about.css';
import './styles/contact.css';
import './styles/album.css';
import './styles/albumstack.css';
import './styles/lightbox.css';
// Tailwind utilities (preflight disabled) + new sphere hero styles.
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
