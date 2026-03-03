// src/store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../services/api'

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/login', credentials)
      console.log('Login API response:', response.data)
      
      // Handle different response structures
      let userData, token;
      
      if (response.data.data && response.data.data.user) {
        // New structure with data wrapper
        userData = response.data.data.user;
        token = response.data.data.token;
      } else if (response.data.user) {
        // Direct structure
        userData = response.data.user;
        token = response.data.token;
      } else {
        // Fallback
        userData = response.data;
        token = response.data.token;
      }
      
      // Store in localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      
      return { user: userData, token }
    } catch (error) {
      console.error('Login error:', error)
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await api.post('/logout')
  } finally {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
})

export const getCurrentUser = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/me')
    return response.data.data || response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to get user')
  }
})

// Check localStorage on initial load
const storedToken = localStorage.getItem('token')
const storedUser = localStorage.getItem('user')

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken,
  isAuthenticated: !!storedToken,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        console.log('Auth state updated:', state)
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isAuthenticated = false
        state.user = null
        state.token = null
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
      })
      // Get Current User
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
        localStorage.setItem('user', JSON.stringify(action.payload))
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer