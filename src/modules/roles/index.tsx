import { useQuery } from "@tanstack/react-query";
import { getRoles } from "../../api/roles";
import { Button, Table } from "antd";
import { useNavigate } from "react-router-dom";

const Role = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery({
    queryKey: ['roles'],
    queryFn: () => getRoles(),
  });
  // console.log("data ", data?.data?.result?.items);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error occurred: {(error as Error).message}</div>;
  }
  const dataSource = data?.data?.data?.items || [];
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
      title: "description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "createdAt",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) =>date ? new Date(date).toLocaleDateString() : '-'
    },
    {
      title: "updatedAt",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date: string) =>date ? new Date(date).toLocaleDateString() : '-'
    },
  ];
  return (
    <div>
            <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Roles</h1>
        <Button type="primary" onClick={() => navigate('/dashboard/roles/create')}>Create Role</Button>
      </div>
      <Table dataSource={dataSource} columns={columns} rowKey="id" />
    </div>
  )
}

export default Role