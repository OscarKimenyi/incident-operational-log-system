import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
})

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      toast.error('Cannot connect to server. Please check if Laravel is running.')
      console.error('Network Error - Make sure Laravel is running on port 8000')
    } else if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
      toast.error('Session expired. Please login again.')
    } else if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.')
    } else if (error.response?.status === 404) {
      toast.error('API endpoint not found. Check your routes.')
      console.error('404 Error:', error.config.url)
    } else if (error.response?.status === 422) {
      const errors = error.response.data.errors
      if (errors) {
        Object.values(errors).forEach((message) => {
          toast.error(message[0])
        })
      }
    } else {
      toast.error(error.response?.data?.message || 'An error occurred')
    }
    return Promise.reject(error)
  }
)

export default api