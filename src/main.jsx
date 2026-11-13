import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { FilesProvider } from './context/FilesContext.jsx'
import './styles.css'
import './styles-extra.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <FilesProvider>
        <App />
      </FilesProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
