import "./index.css"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App"

import { BrowserRouter } from "react-router-dom"
import { ToastContainer } from "react-toastify"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <App />
    </BrowserRouter>
  </StrictMode>
)
