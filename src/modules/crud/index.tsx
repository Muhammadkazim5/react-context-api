import { useQuery } from "@tanstack/react-query"
import { getCrud } from "../../api/crud"
import { Popconfirm, Table } from "antd";
import { EditTwoTone, EyeTwoTone, DeleteTwoTone } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
const Crud = () => {
    const navigate = useNavigate();
    // Fetch posts
    const { data, isLoading } = useQuery({
        queryKey: ["crud"],
        queryFn: () =>
            getCrud({
                page: 1,
                pagesize: 10,
                name: "",
            }),
    });
    // console.log("crud", data?.data?.data?.items);
    const dataSource = data?.data?.data?.items || [];
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'discription',
        },
        {
            title: 'Created At',
            dataIndex: 'created_at',
            key: 'createdAt',
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <div className="flex gap-2">
                    <EditTwoTone
                        twoToneColor="#52C41A"
                        onClick={() => navigate(`/dashboard/posts/edit/${record.id}`)}
                    />
                    <EyeTwoTone
                        onClick={() => navigate(`/dashboard/posts/view/${record.id}`)}
                    />

                    <Popconfirm
                        title="Are you sure?"
                        // onConfirm={() => handleDelete(record.id)}
                        okText="yes"
                        cancelText="no"
                    >
                        <DeleteTwoTone twoToneColor="#FF4D4F" />
                    </Popconfirm>
                </div>
            ),
        }
    ];
    return (
        <div>
            <Table dataSource={dataSource} columns={columns} />;
        </div>
    )
}

export default Crud