import {
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Button,
  Row,
  Col,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { updateUser } from "../../../api/users";

interface UpdateUserProps {
  open: boolean;
  onClose: () => void;
  user: any;
  roles: any[];
}

const UpdateUser = ({ open, onClose, user, roles }: UpdateUserProps) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  // Prefill form when user changes
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        role: user.roles?.[0]?.id,
        image: null,
      });
    }
  }, [user]);

  const uploadProps = {
    beforeUpload: () => false,
    maxCount: 1,
  };

  const handleUpdate = async (values: {
    name: string;
    email: string;
    role: string;
    image: any;
  }) => {
    try {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("roles", values.role);

      if (values.image?.file) {
        formData.append("image", values.image.file);
      }

      await updateUser(user.id, formData);

      message.success("User updated successfully");

      queryClient.invalidateQueries({ queryKey: ["users"] });

      form.resetFields();
      onClose();
    } catch (err) {
      console.log(err);
      message.error("Update failed");
    }
  };

  return (
    <Modal
      title="Update User"
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={() => form.submit()}
    >
      <Form form={form} layout="vertical" onFinish={handleUpdate}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Name" name="name" rules={[{ required: true }]}>
              <Input placeholder="Enter name" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true }, { type: "email" }]}
            >
              <Input placeholder="Enter email" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Role" name="role" rules={[{ required: true }]}>
              <Select placeholder="Select role">
                {roles?.map((r) => (
                  <Select.Option key={r.id} value={r.id}>
                    {r.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Image" name="image">
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>Upload new image</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UpdateUser;
