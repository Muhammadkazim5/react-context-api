import { useQuery } from "@tanstack/react-query";
import { Card, Col, Row, Spin, Statistic } from "antd";
import { UserOutlined, TagsOutlined, FileTextOutlined } from "@ant-design/icons";
import { getUsers } from "../../api/users";
import { getPosts } from "../../api/post";
import { getRoles } from "../../api/roles";

const DashboardHome = () => { 
  const page: number = 1;
  const pagesize : number = 10;
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["users",page, pagesize],
    queryFn: () => getUsers({ page, pagesize}),
  });

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ["posts",page, pagesize],
    queryFn: () => getPosts({ page, pagesize}),
  });

  const { data: rolesData, isLoading: rolesLoading } = useQuery({
    queryKey: ["roles-stats"],
    queryFn: () =>
      getRoles({
        page: 1,
        pageSize: 10,
        id: "",
        name: "",
        description: "",
        createdAt: "",
      }),
  });

  const totalUsers = usersData?.data?.result?.total ?? usersData?.data?.result?.items?.length ?? 0;
  const totalPosts = postsData?.data?.result?.total ?? postsData?.data?.result?.items?.length ?? 0;
  const totalRoles = rolesData?.data?.result?.total ?? rolesData?.data?.data?.items?.length ?? 0;

  const isLoading = usersLoading || postsLoading || rolesLoading;

  const cardStyle = {
    borderRadius: 16,
    boxShadow: "0 4px 24px rgba(0, 0, 0, 0.08)",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={8}>
            <Card style={{ ...cardStyle, borderLeft: "4px solid #1890ff" }} hoverable>
              <Statistic
                title={<span className="text-gray-600 text-base">Total Users</span>}
                value={totalUsers}
                prefix={<UserOutlined style={{ color: "#1890ff", fontSize: 24 }} />}
                valueStyle={{ color: "#1890ff", fontWeight: 600, fontSize: 32 }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Card style={{ ...cardStyle, borderLeft: "4px solid #52c41a" }} hoverable>
              <Statistic
                title={<span className="text-gray-600 text-base">Total Roles</span>}
                value={totalRoles}
                prefix={<TagsOutlined style={{ color: "#52c41a", fontSize: 24 }} />}
                valueStyle={{ color: "#52c41a", fontWeight: 600, fontSize: 32 }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Card style={{ ...cardStyle, borderLeft: "4px solid #722ed1" }} hoverable>
              <Statistic
                title={<span className="text-gray-600 text-base">Total Posts</span>}
                value={totalPosts}
                prefix={<FileTextOutlined style={{ color: "#722ed1", fontSize: 24 }} />}
                valueStyle={{ color: "#722ed1", fontWeight: 600, fontSize: 32 }}
              />
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default DashboardHome;

