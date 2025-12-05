import { useQuery } from "@tanstack/react-query";
import { login } from "../../api/post";
import { Table } from "antd";

const Post = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: () => login({} as any),
  });
  console.log("data ", data?.data?.result?.items);
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
    },
    {
      title: "updatedAt",
      dataIndex: "updatedAt",
      key: "updatedAt",
    },
    {
      title: "deletedAt",
      dataIndex: "deletedAt",
      key: "deletedAt",
    },
    {},
  ];
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey="id" />
    </div>
  );
};

export default Post;
