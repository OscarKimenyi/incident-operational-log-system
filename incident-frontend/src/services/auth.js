import api from './api'

class AuthService {
  async login(email, password) {
    try {
      const response = await api.post('/login', { email, password })
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async logout() {
    try {
      await api.post('/logout')
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }

  async getCurrentUser() {
    try {
      const response = await api.get('/me')
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  getStoredUser() {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch {
        return null
      }
    }
    return null
  }

  isAuthenticated() {
    return !!localStorage.getItem('token')
  }

  handleError(error) {
    if (error.response) {
      return new Error(error.response.data.message || 'Authentication failed')
    }
    return new Error('Network error. Please try again.')
  }
}

export default new AuthService()