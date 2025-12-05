import { useState } from "react";
import { Button, Layout, Menu, message, theme } from "antd";

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";

import { useUser } from "../../hooks/useUser";
import { useLogout } from "../../hooks/auth";
import { useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);

  const { user, setUser } = useUser();
  const logoutMutation = useLogout();
  const navigate = useNavigate();

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
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <UserOutlined />,
              label: "User",
            },
            {
              key: "2",
              icon: <VideoCameraOutlined />,
              label: "Role",
            },
            {
              key: "3",
              icon: <PlusOutlined />,
              label: "Post",
              onClick: () => navigate("/post"),
            },
            {
              key: "4",
              icon: <UserOutlined />,
              label: "Logout",
              onClick: handleLogout,
            },
          ]}
        />
      </Sider>

      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
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
          Content goes here...
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
