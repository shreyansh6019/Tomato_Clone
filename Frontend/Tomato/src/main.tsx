import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

export const authService = "http://localhost:3000";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="809445482925-vnj0qqpmb09aqrqs5sa920q80l23ic0p.apps.googleusercontent.com">  
      <App />
    </GoogleOAuthProvider>;
  </StrictMode>,
)
