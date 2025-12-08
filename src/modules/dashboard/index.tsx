import { useState } from "react";
import { Button, Layout, Menu, message, theme } from "antd";

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusOutlined,
  UserOutlined,
  DashboardOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";

import { useUser } from "../../hooks/useUser";
import { useLogout } from "../../hooks/auth";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);

  const { user, setUser } = useUser();
  const logoutMutation = useLogout();
  const navigate = useNavigate();
  const location = useLocation();

  const selectedKey = (() => {
    const p = location.pathname;
    if (p.startsWith("/dashboard/post") || p === "/post") return "3";
    if (p.startsWith("/dashboard/role")) return "2";
    if (p === "/dashboard" || p === "/dashboard/") return "0";
    if (p.startsWith("/dashboard/user")) return "1";
    return "";
  })();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/");
      },
      onError: (error) => {
        message.error(error.message);
      },
    });
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical " />
        <div className="h-full flex flex-col justify-between">
          <div className="mt-4">
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[selectedKey]}
              items={[
                {
                  key: "0",
                  icon: <DashboardOutlined />,
                  label: "Dashboard",
                  onClick: () => navigate('/dashboard'),
                },
                {
                  key: "1",
                  icon: <UserOutlined />,
                  label: "User",
                  onClick: () => navigate('/dashboard/user'),
                },
                {
                  key: "2",
                  icon: <VideoCameraOutlined />,
                  label: "Role",
                  onClick: () => navigate('/dashboard/role'),
                },
                {
                  key: "3",
                  icon: <PlusOutlined />,
                  label: "Post",
                  onClick: () => navigate("/dashboard/post"),
                },
              ]}
            />
          </div>

          <div>
            <Menu theme="dark" mode="inline" items={[{
              key: "4",
              icon: <UserOutlined />,
              label: "Logout",
              onClick: handleLogout,
            }]} />
          </div>
        </div>
      </Sider>

      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} className="flex justify-between shadow-md">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: 16,
              width: 64,
              height: 64,
            }}
          />
          <span className="mr-4">
            {user && (<span>Welcome, {user.data.name}!</span>)}
          </span>
        </Header>

        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
