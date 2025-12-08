import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../../api/users";
import { Button, Table } from "antd";
import { useNavigate } from "react-router-dom";

const User = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers(),
  });
  // console.log("data ", data?.data?.result?.items);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error occurred: {(error as Error).message}</div>;
  }
  const dataSource = data?.data?.result?.items || [];
  const columns = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "roles",
      key: "roles",
      render: (roles: { id: number; name: string }[]) =>
        roles?.map((role) => role.name).join(", ") || "-",
    },
    {
      title: "createdAt",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => date ? new Date(date).toLocaleDateString() : "-",
    },
    {
      title: "updatedAt",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date: string) => date ? new Date(date).toLocaleDateString() : "-",
    },
  ];
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button type="primary" onClick={() => navigate('/dashboard/users/create')}>Create User</Button>
      </div>
      <Table dataSource={dataSource} columns={columns} rowKey="id" />
    </div>
  )
}

export default User