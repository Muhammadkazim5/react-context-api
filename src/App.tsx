import './App.css'
import AuthLayout from './modules/auth/AuthLayout'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './modules/dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthLayout />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
