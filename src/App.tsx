import "./App.css";
import AuthLayout from "./modules/auth/AuthLayout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./modules/dashboard";
import DashboardHome from "./modules/dashboard/Home";
import Post from "./modules/post";
import User from "./modules/users";
import Role from "./modules/roles";
import Audit from "./modules/audit";
import ModifyPost from "./modules/post/modify/index";
import ViewPost from "./modules/post/view";
import ViewUser from "./modules/users/view/index";
import ViewRole from "./modules/roles/view";
import Crud from "./modules/crud";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthLayout />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="post" element={<Post />} />
          <Route path="post/view/:id" element={<ModifyPost />} />
          <Route path="role" element={<Role />} />
          <Route path="audit" element={<Audit />} />
          <Route path="roles/view/:id" element={<ViewRole />} />
          <Route path="user" element={<User />} />
          <Route path="users/view/:id" element={<ViewUser />} />
          <Route path="post/create" element={<ModifyPost />} />
          <Route path="posts/edit/:id" element={<ModifyPost />} />
          <Route path="posts/view/:id" element={<ViewPost />} />
          <Route path="crud" element={<Crud />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
