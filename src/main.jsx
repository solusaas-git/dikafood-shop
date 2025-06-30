import './styles/fonts.css'; // Custom font definitions
import './assets/fonts/fonts.css'; // Arabic fonts (Cairo)
import './assets/fonts/arabic-utils.css'; // Arabic typography utilities
import './styles/global.css';
import './styles/tailwind.css'; // This will be created by the build process

// Import React and ReactDOM
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { I18nProvider } from './utils/i18n.jsx';
import CurrencyProvider from './contexts/CurrencyContext';
import App from './App';
import config from './config';

// Render the App component to the DOM
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <I18nProvider defaultLocale="fr">
          <CurrencyProvider>
            <App />
          </CurrencyProvider>
        </I18nProvider>
      </HelmetProvider>
    </BrowserRouter>
  </React.StrictMode>
);
