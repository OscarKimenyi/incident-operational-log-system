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

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log('API Request:', config.method.toUpperCase(), config.url)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, response.status)
    return response
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.config?.url)
    
    if (error.code === 'ERR_NETWORK') {
      toast.error('Cannot connect to server. Please check if Laravel is running.')
    } else if (error.response?.status === 401) {
      // Only clear if not on login page
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
        toast.error('Session expired. Please login again.')
      }
    } else if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.')
    } else if (error.response?.status === 404) {
      console.error('404 Error:', error.config.url)
      toast.error('API endpoint not found')
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