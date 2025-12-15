import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createUser, deleteUser, getUsers } from "../../api/users";
import { getRoles } from "../../api/roles";
import { useDebounce } from "../../hooks/useDebounce";

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

import UpdateUser from "./Modify";

const BASE_URL = import.meta.env.VITE_API_URL;

const User = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);

  const [searchValue, setSearchValue] = useState({
    id: "",
    name: "",
    image: "",
    role: "",
  });

  const debouncedSearch = useDebounce(searchValue, 500);

  /* ================= FETCH USERS ================= */
  const { data, isLoading, error } = useQuery({
    queryKey: ["users", page, pageSize, debouncedSearch],
    queryFn: () =>
      getUsers({
        page,
        pagesize: pageSize,
        id: debouncedSearch.id ? parseInt(debouncedSearch.id) : 0,
        name: debouncedSearch.name,
      }),
  });

  /* ================= FETCH ROLES ================= */
  const { data: rolesData, isLoading: rolesLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: () =>
      getRoles({
        page: 1,
        pageSize: 100,
        id: 0,
        name: "",
        description: "",
        createdAt: "",
      }),
  });

  if (error) {
    return <div>Error: {(error as Error).message}</div>;
  }

  const dataSource = data?.data?.result?.items || [];

  /* ================= TABLE COLUMNS ================= */
  const columns = [
    {
      title: (
        <>
          <div>ID</div>
          <Input
            type="number"
            value={searchValue.id}
            onChange={(e) =>
              setSearchValue({ ...searchValue, id: e.target.value })
            }
            placeholder="Search"
          />
        </>
      ),
      dataIndex: "id",
      key: "id",
    },
    {
      title: (
        <>
          <div>Image</div>
          <Input
            placeholder="Image name"
            value={searchValue.image}
            onChange={(e) =>
              setSearchValue({ ...searchValue, image: e.target.value })
            }
          />
        </>
      ),
      dataIndex: "image",
      render: (image: string) => (
        <Image src={`${BASE_URL}/${image}`} width={40} />
      ),
    },

    {
      title: (
        <>
          <div>Name</div>
          <Input
            value={searchValue.name}
            onChange={(e) =>
              setSearchValue({ ...searchValue, name: e.target.value })
            }
            placeholder="Search"
          />
        </>
      ),
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: (
        <div>
          <div>Role</div>
          <Input
            value={searchValue.role}
            onChange={(e) =>
              setSearchValue({
                ...searchValue,
                role: e.target.value,
              })
            }
            placeholder="Role"
          />
        </div>
      ),
      dataIndex: "roles",
      key: "roles",
      render: (roles: any[]) => roles?.map((r) => r.name).join(", ") || "-",
    },

    {
      title: "Created At",
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
            onClick={() => {
              setEditingUser(record);
              setIsUpdateOpen(true);
            }}
          />
          <EyeTwoTone
            onClick={() => navigate(`/dashboard/users/view/${record.id}`)}
          />
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => handleDelete(record.id)}
          >
            <DeleteTwoTone twoToneColor="#FF4D4F" />
          </Popconfirm>
        </div>
      ),
    },
  ];

  /* ================= CREATE USER ================= */
  const handleSubmit = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("password", values.password || "123456");
      formData.append("roles", values.role);

      if (values.image?.file) {
        formData.append("image", values.image.file);
      }

      await createUser(formData);
      message.success("User created successfully");

      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsModalOpen(false);
      form.resetFields();
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  /* ================= DELETE USER ================= */
  const handleDelete = async (id: number) => {
    try {
      await deleteUser({ id });
      message.success("User deleted");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch {
      message.error("Delete failed");
    }
  };

  /* ================= RENDER ================= */
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Create User
        </Button>
      </div>

      <Table
        bordered
        loading={isLoading}
        dataSource={dataSource}
        columns={columns}
        rowKey="id"
        pagination={{
          current: page,
          pageSize,
          onChange: (p, ps) => {
            setPage(p);
            setPageSize(ps);
          },
        }}
      />

      <UpdateUser
        open={isUpdateOpen}
        onClose={() => setIsUpdateOpen(false)}
        user={editingUser}
        roles={rolesData?.data?.data?.items || []}
      />

      {/* CREATE USER MODAL */}
      <Modal
        title="Create User"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Name" name="name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, type: "email" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Role" name="role" rules={[{ required: true }]}>
                <Select loading={rolesLoading}>
                  {rolesData?.data?.data?.items?.map((r: any) => (
                    <Select.Option key={r.id} value={r.id}>
                      {r.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Image" name="image">
                <Upload beforeUpload={() => false} maxCount={1}>
                  <Button icon={<UploadOutlined />}>Upload</Button>
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
