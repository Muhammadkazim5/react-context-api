import "./App.css";
import AuthLayout from "./modules/auth/AuthLayout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./modules/dashboard";
import DashboardHome from "./modules/dashboard/Home";
import Post from "./modules/post";
import User from "./modules/users";
import Role from "./modules/roles";
import ModifyPost from "./modules/post/modify/index";
import ViewPost from "./modules/post/view";
import ViewUser from "./modules/users/view/index";
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
          <Route path="users/view/:id" element={<ViewUser />} />

          <Route path="post/create" element={<ModifyPost />} />
          <Route path="posts/edit/:id" element={<ModifyPost />} />
          <Route path="posts/view/:id" element={<ViewPost />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
