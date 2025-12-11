import { useEffect } from "react";
import { Form, Input, Button, Card, message, Row, Col, Select } from "antd";
import { useEffect, useState } from "react";
import { Form, Input, Button, Modal, message, Row, Col } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createPost, updatePost, getPostById } from "../../../api/post";
import type { IPost } from "../../../interfaces/post";
import { getUsers } from "../../../api/users";

const ModifyPost = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [open, setOpen] = useState(true); // Modal always opens when page loads

  const isEdit = !!id;

  // Fetch single post in edit mode
  const { data: postData } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPostById(Number(id)),
    enabled: isEdit,
  });
  // FETCH USERS FOR SELECT
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers({
        page: 1,
        pagesize: 100
      })
  });
  // console.log('usersData',usersData)
// console.log('edit values',postData)
  // SUBMIT HANDLERS
  const createMutation = useMutation({
    mutationFn: (data: IPost) => createPost(data),
    onSuccess: () => {
      message.success("Post created successfully");
      navigate("/dashboard/post");
    },
  });

  // Update post
  const updateMutation = useMutation({
    mutationFn: (data: IPost) => updatePost(Number(id), data),
    onSuccess: () => {
      message.success("Post updated successfully");
      navigate("/dashboard/post");
    },
  });

  // Set initial values when editing
  useEffect(() => {
    if (postData?.data?.data) {
      const p = postData.data.data;
      form.setFieldsValue({
        title: p.title,
        content: p.content,
         userId: p.user.id,
      });
    }
  }, [postData]);

  // Submit
  const onSubmit = (values: Partial<IPost>) => {
    if (isEdit) {
      updateMutation.mutate(values as IPost);
    } else {
      createMutation.mutate(values as IPost);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    navigate("/dashboard/posts");
  };

  return (
    <div className="flex justify-center items-center ">
    <Card className="max-w-7xl mx-auto mt-8 shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {isEdit ? "Edit Post" : "Create Post"}
      </h2>

      <Form layout="vertical" form={form} onFinish={onSubmit}>
      <Row gutter={32}>
    <Col span={12}>
      <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true, message: "Enter Title" }]}
      >
        <Input placeholder="Enter post title" />
      </Form.Item>
    </Col>

    {/* <Col span={12}>
      {/* <Form.Item
        label="User"
        name="user"
        rules={[{ required: true, message: "Enter username" }]}
      >
        <Input placeholder="Enter username" />
      </Form.Item> */}
    {/* </Col> */}
    <Col span={12}>
              <Form.Item
                label="User"
                name="userId"
                rules={[{ required: true, message: "Select a user" }]}
              >
                <Select placeholder="Select user" loading={usersLoading} allowClear>
                  {/* Map users from API; make sure option value is the numeric id */}
                  {usersData?.data?.result?.items?.map((u: any) => (
                    <Select.Option key={u.id} value={u.id}>
                      {u.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
  </Row>

  {/* ROW 2 (Content full width) */}
  <Row>
    <Col span={24}>
      <Form.Item
        label="Content"
        name="content"
        rules={[{ required: true, message: "Enter content" }]}
      >
        <Input.TextArea rows={4} placeholder="Enter content" />
      </Form.Item>
    </Col>
  </Row>  
        <Button
          key="submit"
          type="primary"
          loading={createMutation.isPending || updateMutation.isPending}
          onClick={() => form.submit()}
        >
          {isEdit ? "Update Post" : "Create Post"}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Enter Title" }]}
            >
              <Input placeholder="Enter post title" />
            </Form.Item>
          </Col>

          {isEdit && (
            <Col span={24}>
              <Form.Item label="User">
                <Input
                  value={postData?.data?.data?.user?.name || ""}
                  disabled
                />
              </Form.Item>
            </Col>
          )}

          <Col span={24}>
            <Form.Item
              label="Content"
              name="content"
              rules={[{ required: true, message: "Enter content" }]}
            >
              <Input.TextArea rows={4} placeholder="Enter content" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ModifyPost;
