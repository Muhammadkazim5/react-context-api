import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Table, Input } from "antd";
import { getAudits } from "../../api/audit";

const Audit = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState("");

    const { data, isLoading, error } = useQuery({
        queryKey: ["audits", page, pageSize, search],
        queryFn: () => getAudits({ page, pagesize: pageSize }),
    });

    if (error) return <div>Error: {(error as Error).message}</div>;

    const dataSource = data?.data?.data?.items || data?.data?.items || data?.data?.result?.items || [];

    const columns = [
        {
            title: (
                <>
                    <div>ID</div>
                    <Input
                        placeholder="Search id"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </>
            ),
            dataIndex: "id",
            key: "id",
        },
        {
            title: "User",
            dataIndex: "user",
            key: "user",
            render: (_: any, record: any) =>
                record?.details?.deleted?.name || record?.user?.data?.name || record?.details?.after?.user?.name || record?.details?.before?.user?.name || "-",
        },
        {
            title: "Action",
            dataIndex: "action",
            key: "action",
        },
        {
            title: "IP",
            dataIndex: "ip",
            key: "ip",
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (d: string) => (d ? new Date(d).toLocaleString() : "-"),
        },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Audit Logs</h1>
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
        </div>
    );
};

export default Audit;
