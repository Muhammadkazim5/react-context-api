import { useEffect, useState } from "react";
import { Form, Input, Button, Modal, message, Row, Col } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createPost, updatePost, getPostById } from "../../../api/post";
import type { IPost } from "../../../interfaces/post";

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

  // Create post
  const createMutation = useMutation({
    mutationFn: (data: IPost) => createPost(data),
    onSuccess: () => {
      message.success("Post created successfully");
      navigate("/dashboard/posts");
    },
  });

  // Update post
  const updateMutation = useMutation({
    mutationFn: (data: IPost) => updatePost(Number(id), data),
    onSuccess: () => {
      message.success("Post updated successfully");
      navigate("/dashboard/posts");
    },
  });

  // Set initial values when editing
  useEffect(() => {
    if (postData?.data?.data) {
      const p = postData.data.data;
      form.setFieldsValue({
        title: p.title,
        content: p.content,
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
    <Modal
      title={isEdit ? "Edit Post" : "Create Post"}
      open={open}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
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
