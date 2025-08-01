import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Import Bootstrap CSS first
import 'bootstrap/dist/css/bootstrap.min.css';
// Import custom styles
import './index.css';

import App from './App.jsx';
import { AudioProvider } from './contexts/AudioProvider';
import { UserProvider } from './contexts/UserProvider';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <AudioProvider>
          <App />
        </AudioProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>,
);
