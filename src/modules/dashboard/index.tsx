import { Button, message } from 'antd'
import { useUser } from '../../hooks/useUser'
import { useLogout } from '../../hooks/auth'
import { useNavigate } from 'react-router-dom'
const Dashboard = () => {
    const { user, setUser } = useUser()
    const logoutMutation = useLogout()
    const navigate = useNavigate()
    const handleLogout = () => {
        logoutMutation.mutate(undefined, {

            onSuccess: () => {
                localStorage.removeItem('accessToken')
                localStorage.removeItem('user')
                setUser(null)
                navigate('/')
            },
            onError: (error) => {
                message.error(error.message)
            }
        })
    }

  return (
    <div className="p-4 flex flex-col items-center justify-center h-screen bg-gray-100" >
        <h1 className="text-2xl font-bold" >Welcome {user?.data?.name} to your dashboard</h1>
        <Button type="primary" onClick={handleLogout} loading={logoutMutation.isPending} >Logout</Button>
    </div>
  )
}

export default Dashboard