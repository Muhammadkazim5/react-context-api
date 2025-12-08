import "./App.css";
import AuthLayout from "./modules/auth/AuthLayout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./modules/dashboard";
import DashboardHome from "./modules/dashboard/Home";
import Post from "./modules/post";
import User from "./modules/users";
import Role from "./modules/roles";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthLayout />} />
        <Route path="/dashboard" element={<Dashboard />}> 
          <Route index element={<DashboardHome />} />
          <Route path="post" element={<Post />} />
          <Route path="role" element={<Role />} />
          <Route path="user" element={<User />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
