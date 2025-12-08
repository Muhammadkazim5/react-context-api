import { useQuery } from "@tanstack/react-query";
import { getRoles } from "../../api/roles";
import { Button, Table, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDebounce } from "../../hooks/useDebounce"; // <-- add this import
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

  // ⏳ Apply debounce (500ms)
  const debouncedSearch = useDebounce(searchValue, 500);

  const { data, isLoading, error } = useQuery({
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
            size="middle"
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
            size="middle"
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
            size="middle"
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
            size="middle"
            type="datetime-local"
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
      dataIndex: "action",
      key: "action",
      render: (value: number) => (
        <div className="flex gap-2">
         <EditTwoTone twoToneColor="#52C41A" onClick={() => navigate(`/dashboard/roles/${value}`)} />
         <EyeTwoTone onClick={() => navigate(`/dashboard/roles/${value}`)} />
         <DeleteTwoTone twoToneColor="#FF4D4F" onClick={() => navigate(`/dashboard/roles/${value}`)} />
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Roles</h1>
        <Button type="primary" onClick={() => navigate("/dashboard/roles/create")}>
          Create Role
        </Button>
      </div>

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
