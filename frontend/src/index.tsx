import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import './index.css';
//import './media.css';
import { BrowserRouter } from 'react-router-dom';

/**
 * Main component of the application.
 */

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);