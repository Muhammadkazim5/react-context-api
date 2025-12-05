import { Button, Form, Input } from 'antd'
import type { ILogin } from '../../interfaces/auth'
import { useLogin } from '../../hooks/auth'
import { useUser } from '../../hooks/useUser'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const [form] = Form.useForm()
    const loginMutation = useLogin()
    const { setUser } = useUser()
    const navigate = useNavigate()
    const onFinish = (values: ILogin) => {
        loginMutation.mutate(values, {
            onSuccess: (response) => {
                    // Save accessToken to localStorage
                const { accessToken } = response.data.data
                localStorage.setItem('accessToken', accessToken)
                // Set the user in context after successful login
                setUser(response.data)
                navigate('/dashboard')
            }
        })
    }

    return (
        <div className="space-y-4" >
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item label="Email" name="email">
                    <Input />
                </Form.Item>
                <Form.Item label="Password" name="password">
                    <Input />
                </Form.Item>
                <Button type="primary" htmlType="submit" loading={loginMutation.isPending}>
                    Login
                </Button>
            </Form>
        </div>
    )
}

export default Login