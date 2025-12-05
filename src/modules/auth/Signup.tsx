import { Button, Form, Input, message } from 'antd'
import type { ISignup } from '../../interfaces/auth'
import { useRegister } from '../../hooks/auth'
import { useUser } from '../../hooks/useUser'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
const Signup = () => {
    const [form] = Form.useForm()
    const registerMutation = useRegister()
    const { setUser } = useUser()

    const onFinish = (values: ISignup & { confirmPassword: string }) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirmPassword, ...payload } = values
        registerMutation.mutate(payload, {
            onSuccess: (response) => {
                // Set the user in context after successful registration
                setUser(response.data.data)
                form.resetFields()
                message.success(response.data.message)
            }
        })
    }

    return (
        <div className="space-y-4" >
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item label="Name" name="name">
                    <Input placeholder="Enter your name" prefix={<UserOutlined />} size="large"/>
                </Form.Item>
                <Form.Item label="Email" name="email">
                    <Input placeholder="Enter your email" prefix={<UserOutlined />} size="large"/>
                </Form.Item>
                <Form.Item label="Password" name="password">
                    <Input placeholder="Enter your password" prefix={<LockOutlined />} size="large"/>
                </Form.Item>
                <Form.Item label="Confirm Password" name="confirmPassword">
                    <Input placeholder="Confirm your password" prefix={<LockOutlined />} size="large"/>
                </Form.Item>
                <Button type="primary" htmlType="submit" loading={registerMutation.isPending}>
                    Signup
                </Button>
            </Form>
        </div>
    )
}

export default Signup