import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';

const domain = "dev-tbvg0u76pp8osw76.us.auth0.com";
const clientId = "OwJOQ5CsF2i0wkuwyCGme5hsbauLQeKI";
const audience = "https://dev-tbvg0u76pp8osw76.us.auth0.com/api/v2/";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: audience,
    }}
  >
    <App />
  </Auth0Provider>
);
