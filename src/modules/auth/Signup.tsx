import { Button, Form, Input, message, Alert } from 'antd'
import { useState } from 'react'
import type { AxiosError } from 'axios'
import type { ISignup } from '../../interfaces/auth'
import { useRegister } from '../../hooks/auth'
import { useUser } from '../../hooks/useUser'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
const Signup = () => {
    const [form] = Form.useForm()
    const registerMutation = useRegister()
    const { setUser } = useUser()
    const [serverError, setServerError] = useState<string | null>(null)

    const onFinish = (values: ISignup & { confirmPassword: string }) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirmPassword, ...payload } = values
        registerMutation.mutate(payload, {
            onSuccess: (response) => {
                // Set the user in context after successful registration
                setUser(response.data.data)
                form.resetFields()
                setServerError(null)
                message.success(response.data.message)
            }
            ,
            onError: (err: unknown) => {
                // Try to extract server error message (axios response shape)
                const axiosErr = err as AxiosError & { response?: { data?: { message?: string } } }
                const msg = axiosErr?.response?.data?.message || axiosErr?.message || 'Something went wrong'
                setServerError(msg)
            }
        })
    }

    return (
        <div className="space-y-4" >
            {serverError && (
                <Alert type="error" message={serverError} showIcon />
            )}
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item label="Name" name="name">
                    <Input placeholder="Enter your name" prefix={<UserOutlined />} size="large" />
                </Form.Item>
                <Form.Item label="Email" name="email">
                    <Input placeholder="Enter your email" prefix={<UserOutlined />} size="large" />
                </Form.Item>
                <Form.Item label="Password" name="password">
                    <Input placeholder="Enter your password" prefix={<LockOutlined />} size="large" />
                </Form.Item>
                <Form.Item label="Confirm Password" name="confirmPassword">
                    <Input placeholder="Confirm your password" prefix={<LockOutlined />} size="large" />
                </Form.Item>
                <Button type="primary" htmlType="submit" loading={registerMutation.isPending}>
                    Signup
                </Button>
            </Form>
        </div>
    )
}

export default Signup