import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// @ts-expect-error CSS is loaded by the bundler and has no TypeScript declarations.
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AppProvider } from './context/AppProvider.tsx';

export const authService = "http://localhost:3000";
export const restaurantService = "http://localhost:3001";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="809445482925-vnj0qqpmb09aqrqs5sa920q80l23ic0p.apps.googleusercontent.com">
      <AppProvider>
        <App />
      </AppProvider>
    </GoogleOAuthProvider>;
  </StrictMode>,
)
