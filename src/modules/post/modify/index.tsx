import { useEffect } from "react";
import { Form, Input, Button, Card, message, Row, Col, Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createPost, updatePost, getPostById } from "../../../api/post";
import type { IPost } from "../../../interfaces/post";
import { getUsers } from "../../../api/users";


const ModifyPost = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams(); // If exists → Edit Mode

  const isEdit = !!id;

  // FETCH POST IN EDIT MODE
  const { data: postData, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPostById(id),
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
    mutationFn: (data : IPost) => createPost(data),
    onSuccess: () => {
      message.success("Post created successfully");
      navigate("/dashboard/post");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: IPost) => updatePost(id, data),
    onSuccess: () => {
      message.success("Post updated successfully");
      navigate("/dashboard/post");
    },
  });

  // SET INITIAL VALUES WHEN EDITING
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

  const onSubmit = (values) => {
    if (isEdit) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  };
  if(isLoading){
    return <div>loading...</div>
  }
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
          loading={createMutation.isPending || updateMutation.isPending}
          type="primary"
          htmlType="submit"
          block
        >
          {isEdit ? "Update Post" : "Create Post"}
        </Button>
      </Form>
    </Card>
    </div>
  );
};

export default ModifyPost;
