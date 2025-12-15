import { useEffect, useState } from "react";
import { Row, Col, Card, Typography, Button } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { getPostById } from "../../../api/post";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const ViewPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const navigete = useNavigate();
  useEffect(() => {
    getPostById(Number(id)).then((res) => {
      setPost(res.data.data);
    });
  }, [id]);

  if (!post) return <p>Loading...</p>;

  return (
    <div className="flex justify-center items-center">
      <Card style={{ width: "100%", maxWidth: 600 }} className="relative">
        {/* Close Button - Top Left */}
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigete(-1)}>
          Back
        </Button>

        {/* Content */}
        <div className="mt-8">
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={6}>
              <Title level={5}>Title</Title>
            </Col>
            <Col span={18}>
              <Paragraph>{post.title}</Paragraph>
            </Col>
          </Row>

          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={6}>
              <Title level={5}>User</Title>
            </Col>
            <Col span={18}>
              <Paragraph>{post.user?.name || "Unknown User"}</Paragraph>
            </Col>
          </Row>

          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={6}>
              <Title level={5}>Content</Title>
            </Col>
            <Col span={18}>
              <Paragraph>{post.content}</Paragraph>
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  );
};

export default ViewPost;
