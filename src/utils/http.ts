import axios from 'axios'

const http = axios.create({
  baseURL: 'http://localhost:3000',
  // baseURL: 'http://192.168.0.104:3000',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add accessToken to every request if available
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default http