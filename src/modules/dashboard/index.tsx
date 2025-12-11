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
    if (p.startsWith("/dashboard/post")) return "3";
    if (p.startsWith("/dashboard/role")) return "2";
    if (p === "/dashboard" || p === "/dashboard/") return "0";
    if (p.startsWith("/dashboard/user")) return "1";
    return "";
  })();

  const {
    token: { colorBgContainer },
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
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      {/* FIXED SIDEBAR */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          height: "100vh",
          overflowY: "auto",
          zIndex: 100,
        }}
      >
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
                  onClick: () => navigate("/dashboard"),
                },
                {
                  key: "1",
                  icon: <UserOutlined />,
                  label: "User",
                  onClick: () => navigate("/dashboard/user"),
                },
                {
                  key: "2",
                  icon: <VideoCameraOutlined />,
                  label: "Role",
                  onClick: () => navigate("/dashboard/role"),
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

          <Menu
            theme="dark"
            mode="inline"
            items={[
              {
                key: "4",
                icon: <UserOutlined />,
                label: "Logout",
                onClick: handleLogout,
              },
            ]}
          />
        </div>
      </Sider>

      {/* MAIN AREA */}
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 200,
          height: "100vh",
          transition: "all 0.2s",
        }}
      >
        {/* FIXED HEADER */}
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            position: "fixed",
            left: collapsed ? 80 : 200,
            right: 0,
            top: 0,
            height: 64,
            zIndex: 50,
            transition: "all 0.2s",
          }}
          className="flex justify-between shadow-md"
        >
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
            {user && (
              <span className="text-lg">
                Welcome ,{" "}
                <span className="text-blue-500 font-bold">
                  {user.data.name}
                </span>
                !
              </span>
            )}
          </span>
        </Header>

        {/* SCROLLABLE PAGE CONTENT */}
        <Content
          style={{
            padding: 24,
            marginTop: 64,
            height: "calc(100vh - 64px)",
            overflowY: "auto",
            background: colorBgContainer,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
