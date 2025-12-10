import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, message, Popconfirm, Table } from "antd";
import { deletePost, getPosts } from "../../api/post";
import { useNavigate } from "react-router-dom";

import { EditTwoTone, EyeTwoTone, DeleteTwoTone } from "@ant-design/icons";

const Post = () => {
  const navigate = useNavigate();
  const { data, error, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: () =>
      getPosts({
        page: 1,
        name: "",
        pagesize: 10,
        id: 0,
      }),
  });
  // console.log("data ", data?.data?.result?.items);
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deletePost(id),
    onSuccess: () => {
      message.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] }); // refresh posts
    },
    onError: () => {
      message.error("Failed to delete post");
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };
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
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (user: any) => user?.name || "-"
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
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString() : "-",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <EditTwoTone
            twoToneColor="#52C41A"
            onClick={() => navigate(`/dashboard/posts/edit/${record.id}`)}
          />
          <EyeTwoTone
            onClick={() => navigate(`/dashboard/posts/view/${record.id}`)}
          />
           <Popconfirm
            title="Are you sure you want to delete this post?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <DeleteTwoTone twoToneColor="#FF4D4F" />
          </Popconfirm>
        </div>
      ),
    },
  ];
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Posts</h1>
        <Button
          type="primary"
          onClick={() => navigate("create")}
        >
          Create Post
        </Button>
      </div>
      <Table
        loading={isLoading}
        dataSource={dataSource}
        columns={columns}
        rowKey="id"
        bordered
      />
    </div>
  );
};

export default Post;
