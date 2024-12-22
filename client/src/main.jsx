import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from "./context/AuthContext";
import App from './App.jsx'
import '../global.css'; // 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
					<App />
			</AuthContextProvider>
    </BrowserRouter>
  </StrictMode>,
)