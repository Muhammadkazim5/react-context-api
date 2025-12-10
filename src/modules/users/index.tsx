import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createUser, deleteUser, getUsers } from "../../api/users";
import { getRoles } from "../../api/roles";

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
  Image,
  Upload,
  Popconfirm,
} from "antd";
import { useState } from "react";
import {
  EditTwoTone,
  EyeTwoTone,
  DeleteTwoTone,
  UploadOutlined,
} from "@ant-design/icons";
const User = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const { data, isLoading, error } = useQuery({
    queryKey: ["users", page, pageSize],
    queryFn: () =>
      getUsers({
        page,
        pagesize: pageSize,
        id: 0,
        name: "",
      }),
  });

  // fetch roles for the role select so we can send role id in payload
  const { data: rolesData, isLoading: rolesLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: () =>
      getRoles({
        page: 1,
        pageSize: 100,
        id: "",
        name: "",
        description: "",
        createdAt: "",
      }),
  });
  // console.log("roles",rolesData)
  if (error) {
    return <div>Error occurred: {(error as Error).message}</div>;
  }

  const dataSource = data?.data?.result?.items || [];

  const uploadProps = {
    beforeUpload: () => false,
    maxCount: 1,
  };

  const columns = [
    { title: "id", dataIndex: "id", key: "id" },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image: string) =>
        image ? (
          <Image
            src={`http://192.168.0.104:3000/${image}`}
            style={{ width: 50, height: 50, borderRadius: "50%" }}
          />
        ) : (
          <span>No Image</span>
        ),
    },
    { title: "name", dataIndex: "name", key: "name" },
    { title: "email", dataIndex: "email", key: "email" },
    {
      title: "Role",
      dataIndex: "roles",
      key: "roles",
      render: (roles: { name: string }[]) =>
        roles?.map((r: { name: string }) => r.name).join(", ") || "-",
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
      key: "ction",
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <EditTwoTone twoToneColor="#52C41A" />
          <EyeTwoTone
            onClick={() => navigate(`/dashboard/users/view/${record.id}`)}
          />

          <Popconfirm
            title="Are you sure?"
            onConfirm={() => handleDelete(record.id)}
            okText="yes"
            cancelText="no"
          >
            <DeleteTwoTone twoToneColor="#FF4D4F" />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const showModal = () => setIsModalOpen(true);

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleSubmit = async (values: any) => {
    try {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("password", values.password || "123456");

      // append roles array correctly
      formData.append("roles", values.role); // backend will convert number → array

      // append image file
      if (values.image?.file) {
        formData.append("image", values.image.file);
      }

      await createUser(formData); // MUST send FormData

      message.success("User created successfully");

      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsModalOpen(false);
      form.resetFields();
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Something went wrong!";
      message.error(msg);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUser({ id });
      message.success("user deleted successfully!");

      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (err) {
      message.error("Failed to delete");
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
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Enter a name" }]}
              >
                <Input placeholder="Enter name" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Enter an email" },
                  { type: "email", message: "Invalid email" },
                ]}
              >
                <Input placeholder="Enter email" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Role"
                name="role"
                rules={[{ required: true, message: "Select a role" }]}
              >
                <Select placeholder="Select role" loading={rolesLoading}>
                  {/* Map roles from API; make sure option value is the numeric id */}
                  {rolesData?.data?.data?.items?.map((r: any) => (
                    <Select.Option key={r.id} value={r.id}>
                      {r.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* Password - required by createUser API */}
            {/* <Col span={12}>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Enter a password" }]}
              >
                <Input.Password placeholder="Enter password" />
              </Form.Item>
            </Col> */}

            <Col span={12}>
              <Form.Item label="Image" name="image">
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default User;
