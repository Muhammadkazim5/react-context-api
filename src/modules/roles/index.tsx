import { useQuery } from "@tanstack/react-query";
import { getRoles } from "../../api/roles";
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
  const [form] = Form.useForm();

  // Debounced Search
  const debouncedSearch = useDebounce(searchValue, 500);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["roles", { page, pageSize, ...debouncedSearch }],
    queryFn: () =>
      getRoles({
        page,
        pageSize,
        id: debouncedSearch.id,
        name: debouncedSearch.name,
        description: debouncedSearch.description,
        createdAt: debouncedSearch.createdAt,
      }),
  });

  if (error) return <div>Error occurred: {(error as Error).message}</div>;

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
            onClick={() => navigate(`/dashboard/roles/edit/${record.id}`)}
          />
          <EyeTwoTone
            onClick={() => navigate(`/dashboard/roles/view/${record.id}`)}
          />
          <DeleteTwoTone
            twoToneColor="#FF4D4F"
            onClick={() => navigate(`/dashboard/roles/delete/${record.id}`)}
          />
        </div>
      ),
    },
  ];

  // Modal Controls
  const showModal = () => setIsModalOpen(true);

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleSubmit = async (values: any) => {
    console.log("Form values:", values);

    // Call your create role API here
    // await createRole(values);

    message.success("Role created successfully!");

    setIsModalOpen(false);
    form.resetFields();

    // Refresh roles list
    refetch();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Roles</h1>
        <Button type="primary" onClick={showModal}>
          Create Role
        </Button>
      </div>

      {/* Create Role Modal */}
      <Modal
        title="Create Role"
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
              <Form.Item label="Description" name="description" rules={[]}>
                <Input.TextArea placeholder="Enter description" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Roles Table */}
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
