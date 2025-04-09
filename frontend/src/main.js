import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { useEffect } from "react";
import useAuthStore from "./stores/authStore";

const fetchUser = useAuthStore(state => state.fetchUser);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
