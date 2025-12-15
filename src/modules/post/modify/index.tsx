import { useEffect } from "react";
import { Form, Input, Button, Card, message, Row, Col, Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createPost, updatePost, getPostById } from "../../../api/post";
import { getUsers } from "../../../api/users";
import type { IPost } from "../../../interfaces/post";
import { ArrowLeftOutlined } from "@ant-design/icons";

const ModifyPost = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const isEdit = !!id;

  // Fetch post (edit mode)
  const { data: postData } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPostById(Number(id)),
    enabled: isEdit,
  });

  // Fetch users
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      getUsers({
        page: 1,
        pagesize: 100,
        id: 0,
        name: "",
      }),
  });

  // Create
  const createMutation = useMutation({
    mutationFn: (data: IPost) => createPost(data),
    onSuccess: () => {
      message.success("Post created successfully");
      navigate("/dashboard/post");
    },
  });

  // Update
  const updateMutation = useMutation({
    mutationFn: (data: IPost) => updatePost(Number(id), data),
    onSuccess: () => {
      message.success("Post updated successfully");
      navigate("/dashboard/post");
    },
  });

  // Set edit values
  useEffect(() => {
    if (postData?.data?.data) {
      const p = postData.data.data;
      form.setFieldsValue({
        title: p.title,
        content: p.content,
        userId: p.user.id,
      });
    }
  }, [postData, form]);

  const onSubmit = (values: Partial<IPost>) => {
    if (isEdit) {
      updateMutation.mutate(values as IPost);
    } else {
      createMutation.mutate(values as IPost);
    }
  };

  return (
    <div className="flex justify-center ">
      <Card className="w-full max-w-5xl mt-8 shadow-md" bordered>
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
        <h2 className="text-xl font-semibold mb-6 mt-6">
          {isEdit ? "Edit Post" : "Create Post"}
        </h2>

        <Form layout="vertical" form={form} onFinish={onSubmit}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Title"
                name="title"
                rules={[{ required: true, message: "Enter title" }]}
              >
                <Input placeholder="Enter post title" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="User"
                name="userId"
                rules={[{ required: true, message: "Select a user" }]}
              >
                <Select
                  placeholder="Select user"
                  loading={usersLoading}
                  allowClear
                >
                  {usersData?.data?.result?.items?.map((u: any) => (
                    <Select.Option key={u.id} value={u.id}>
                      {u.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <Form.Item
                label="Content"
                name="content"
                rules={[{ required: true, message: "Enter content" }]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>
            </Col>
          </Row>

          <div className="flex gap-3 mt-4">
            <Button
              htmlType="submit"
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {isEdit ? "Update Post" : "Create Post"}
            </Button>
            <Button onClick={() => navigate(-1)}>Cancel</Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ModifyPost;
