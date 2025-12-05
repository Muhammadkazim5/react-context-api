import Login from "./Login"
import Signup from "./Signup"
import { Tabs } from "antd"
const items = [
    {
        label: 'Login',
        key: 'login',
        children: <Login />
    },
    {
        label: 'Signup',
        key: 'signup',
        children: <Signup />
    }
]
const AuthLayout = () => {
  return (
    <div className="w-7xl mx-auto h-screen flex items-center justify-center " >
      <div className="w-full max-w-md bg-blue-100 p-6 rounded-md shadow-md" >
      <Tabs items={items}defaultActiveKey="login" centered  />
      </div>
    </div>
  )
}

export default AuthLayout