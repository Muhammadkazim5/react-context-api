// import { useParams } from "react-router-dom"

// const ViewRole = () => {
//     const {id} = useParams()
//   return (
//     <div>
//       <h1>view role{id}</h1>
//     </div>
//   )
// }

// export default ViewRole

import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, Typography, Tag } from "antd";
import { getRoleById } from "../../../api/roles";

const { Title, Paragraph } = Typography;

const ViewRole = () => {
  const { id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["role", id],
    queryFn: () => getRoleById(id),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading role</p>;

  const role = data?.data?.data;

  return (
    <div className="flex justify-center mt-10">
      <Card title={`Role Details`} bordered className="w-full max-w-3xl shadow-md">
        <Title level={3}>{role.name}</Title>

        <Paragraph>
          <strong>Description:</strong>{" "}
          {role.description || "No description available"}
        </Paragraph>

        <Paragraph>
          <strong>Created At:</strong>{" "}
          {new Date(role.createdAt).toLocaleString()}
        </Paragraph>
      </Card>
    </div>
  );
};

export default ViewRole;

