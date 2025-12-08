import { useQuery } from "@tanstack/react-query";
import { Button, Table } from "antd";
import { getPosts } from "../../api/post";
import { useNavigate } from "react-router-dom";

const Post = () => {
  const navigate = useNavigate();
  const { data, error, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getPosts(),
  });
  console.log("data ", data?.data?.result?.items);
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
      title: "title",
      dataIndex: "title",
      key: "title",
    },

    {
      title: "content",
      dataIndex: "content",
      key: "content",
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
        <h1 className="text-2xl font-bold">Posts</h1>
        <Button type="primary" onClick={() => navigate('/dashboard/posts/create')}>Create Post</Button>
      </div>
      <Table loading={isLoading} dataSource={dataSource} columns={columns} rowKey="id" />
    </div>
  );
};

export default Post;
