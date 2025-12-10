import { useEffect, useState } from "react";
import { Modal, Row, Col, Typography, Spin, Image } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { viewUser } from "../../../api/users";

const { Title, Paragraph } = Typography;

const ViewUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      viewUser(Number(id))
        .then((res) => {
          setUser(res.data.result || res.data.data); // adapt to your API
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleClose = () => {
    setIsModalOpen(false);
    navigate(-1); // go back to previous page (users list)
  };

  return (
    <Modal
      title={`User Details: ${user?.name || ""}`}
      open={isModalOpen}
      onCancel={handleClose}
      footer={null}
    >
      {loading ? (
        <div className="flex justify-center items-center">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={6}>
              <Title level={5}>Email</Title>
            </Col>
            <Col span={18}>
              <Paragraph>{user?.email || "-"}</Paragraph>
            </Col>
          </Row>

          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={6}>
              <Title level={5}>User</Title>
            </Col>
            <Col span={18}>
              <Paragraph>{user?.name || "Unknown User"}</Paragraph>
            </Col>
          </Row>

          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={6}>
              <Title level={5}>Role</Title>
            </Col>
            <Col span={18}>
              <Paragraph>
                {user?.roles?.map((r: any) => r.name).join(", ") || "-"}
              </Paragraph>
            </Col>
          </Row>

          {user?.image && (
            <Row gutter={16}>
              <Col span={6}>
                <Title level={5}>Image</Title>
              </Col>
              <Col span={18}>
                <Image
                  src={`http://192.168.0.104:3000/${user.image}`}
                  alt={user.name}
                  width={100}
                  style={{ borderRadius: "50%" }}
                />
              </Col>
            </Row>
          )}
        </>
      )}
    </Modal>
  );
};

export default ViewUser;
