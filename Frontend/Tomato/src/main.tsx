import { StrictMode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
// @ts-expect-error CSS is loaded by the bundler and has no TypeScript declarations.
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AppProvider } from './context/AppProvider.tsx';

export const authService = "http://localhost:3000";
export const restaurantService = "http://localhost:3001";

const rootElement = document.getElementById('root')!;

// 1. Declare a global variable type extension for TypeScript
declare global {
  interface Window {
    __reactRoot?: Root;
  }
}

// 2. Check if a root already exists on the window object. 
// If it doesn't, create it once. If it does, reuse it.
if (!window.__reactRoot) {
  window.__reactRoot = createRoot(rootElement);
}

// 3. Always call .render() on the preserved root instance
window.__reactRoot.render(
  <StrictMode>
    <GoogleOAuthProvider clientId="809445482925-vnj0qqpmb09aqrqs5sa920q80l23ic0p.apps.googleusercontent.com">
      <AppProvider>
        <App />
      </AppProvider>
    </GoogleOAuthProvider>;
  </StrictMode>,
)
