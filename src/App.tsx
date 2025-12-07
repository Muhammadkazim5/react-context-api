import "./App.css";
import AuthLayout from "./modules/auth/AuthLayout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./modules/dashboard";
import Post from "./modules/post";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthLayout />} />
        <Route path="/dashboard" element={<Dashboard />}> 
          <Route index element={<div>Dashboard Home</div>} />
          <Route path="post" element={<Post />} />
          <Route path="role" element={<div>Role Page</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
