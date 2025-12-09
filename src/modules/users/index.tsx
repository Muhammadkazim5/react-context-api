import { useQuery } from "@tanstack/react-query";
import { createUser } from "../../api/users";

import { getUsers } from "../../api/users";
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  message,
  Row,
  Col,
  Select,
} from "antd";
import { useState } from "react";
import { EditTwoTone, EyeTwoTone, DeleteTwoTone } from "@ant-design/icons";

const User = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      getUsers({
        page,
        pagesize: pageSize,
        id: 0,
        name: "",
      }),
  });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

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
      title: "Image",
      dataIndex: "image",
      key: "image",
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
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString() : "-",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, _record: any) => (
        <div className="flex gap-2">
          <EditTwoTone twoToneColor="#52C41A" />
          <EyeTwoTone />
          <DeleteTwoTone twoToneColor="#FF4D4F" />
        </div>
      ),
    },
  ];

  // Open modal
  const showModal = () => {
    setIsModalOpen(true);
  };

  // Close modal
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  // Submit form
  const handleSubmit = async (values: any) => {
    try {
      await createUser(values);

      message.success("User created successfully!");
      setIsModalOpen(false);
      form.resetFields();
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button type="primary" onClick={showModal}>
          Create User
        </Button>
      </div>

      <Table
        loading={isLoading}
        dataSource={dataSource}
        columns={columns}
        rowKey="id"
        bordered
        pagination={{
          current: page,
          pageSize: pageSize,
          onChange: (newPage, newPageSize) => {
            setPage(newPage);
            setPageSize(newPageSize);
          },
        }}
      />

      {/* Create User Modal */}
      <Modal
        title="Create User"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Name" name="name">
                <Input placeholder="Enter name" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ type: "email", message: "Invalid email" }]}
              >
                <Input placeholder="Enter email" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Role" name="role">
                <Select placeholder="Select role">
                  <Select.Option value="admin">Admin</Select.Option>
                  <Select.Option value="manager">Manager</Select.Option>
                  <Select.Option value="user">User</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default User;
