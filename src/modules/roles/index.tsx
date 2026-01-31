import { useQuery } from "@tanstack/react-query";
import { getRoles, deleteRoleById, createRole, updateRoleById } from "../../api/roles";
import { Button, Table, Input, Col, Row, Modal, Form, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { EditTwoTone, EyeTwoTone, DeleteTwoTone } from "@ant-design/icons";

const Role = () => {
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState({
    id: "",
    name: "",
    description: "",
    createdAt: "",
  });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);

  const [form] = Form.useForm();
  const debouncedSearch = useDebounce(searchValue, 500);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["roles", { page, pageSize, ...debouncedSearch }],
    queryFn: () =>
      getRoles({
        page,
        pagesize: pageSize,
        id: debouncedSearch.id,
        name: debouncedSearch.name,
        description: debouncedSearch.description,
        createdAt: debouncedSearch.createdAt,
      }),
  });

  if (error) return <div>Error occurred: {(error as Error).message}</div>;
  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this role?",
      okText: "Yes",
      okType: "danger",
      onOk: async () => {
        await deleteRoleById(id);
        message.success("Role deleted");
        refetch();
      }
    });
  };
  const dataSource = data?.data?.data?.items || [];

  const columns = [
    {
      title: (
        <div>
          <div>ID</div>
          <Input
            type="number"
            value={searchValue.id}
            onChange={(e) =>
              setSearchValue({ ...searchValue, id: e.target.value })
            }
            placeholder="Search"
          />
        </div>
      ),
      dataIndex: "id",
      key: "id",
    },
    {
      title: (
        <div>
          <div>Name</div>
          <Input
            value={searchValue.name}
            onChange={(e) =>
              setSearchValue({ ...searchValue, name: e.target.value })
            }
            placeholder="Search"
          />
        </div>
      ),
      dataIndex: "name",
      key: "name",
    },
    {
      title: (
        <div>
          <div>Description</div>
          <Input
            value={searchValue.description}
            onChange={(e) =>
              setSearchValue({ ...searchValue, description: e.target.value })
            }
            placeholder="Search"
          />
        </div>
      ),
      dataIndex: "description",
      key: "description",
    },
    {
      title: (
        <div>
          <div>Created At</div>
          <Input
            type="date"
            value={searchValue.createdAt}
            onChange={(e) =>
              setSearchValue({ ...searchValue, createdAt: e.target.value })
            }
          />
        </div>
      ),
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <EditTwoTone
            twoToneColor="#52C41A"
            onClick={() => {
              setIsEditMode(true);
              setEditingRole(record);
              form.setFieldsValue(record);
              setIsModalOpen(true);
            }}
          />

          <EyeTwoTone
            onClick={() => navigate(`/dashboard/roles/view/${record.id}`)}
          />

          <DeleteTwoTone
            twoToneColor="#FF4D4F"
            onClick={() => handleDelete(record.id)}
          />
        </div>
      ),
    },
  ];

  // Modal Cancel
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setIsEditMode(false);
    setEditingRole(null);
  };

  // Submit (Create or Update)
  const handleSubmit = async (values: any) => {
    try {
      if (isEditMode) {
        await updateRoleById(editingRole.id, values);
        message.success("Role updated successfully!");
      } else {
        await createRole(values);
        message.success("Role created successfully!");
      }

      setIsModalOpen(false);
      form.resetFields();
      setIsEditMode(false);
      setEditingRole(null);

      refetch();
    } catch (err) {
      message.error("Something went wrong!");
    }
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Roles</h1>
        <Button
          type="primary"
          onClick={() => {
            setIsEditMode(false);
            setEditingRole(null);
            form.resetFields();
            setIsModalOpen(true);
          }}
        >
          Create Role
        </Button>
      </div>

      {/* Modal */}
      <Modal
        title={isEditMode ? "Edit Role" : "Create Role"}
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Role Name" name="name">
                <Input placeholder="Enter role name" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Description" name="description">
                <Input.TextArea placeholder="Enter description" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Table */}
      <Table
        loading={isLoading}
        bordered
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        pagination={{
          current: page,
          pageSize: pageSize,
          onChange: (newPage, newPageSize) => {
            setPage(newPage);
            setPageSize(newPageSize);
          },
        }}
      />
    </div>
  );
};

export default Role;
