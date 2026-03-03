import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../services/api'

// Async thunks
export const fetchIncidents = createAsyncThunk(
  'incidents/fetchIncidents',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters).toString()
      const response = await api.get(`/incidents?${params}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch incidents')
    }
  }
)

export const fetchIncident = createAsyncThunk(
  'incidents/fetchIncident',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/incidents/${id}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch incident')
    }
  }
)

export const createIncident = createAsyncThunk(
  'incidents/createIncident',
  async (incidentData, { rejectWithValue }) => {
    try {
      const response = await api.post('/incidents', incidentData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create incident')
    }
  }
)

export const updateIncidentStatus = createAsyncThunk(
  'incidents/updateStatus',
  async ({ id, status, comment }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/incidents/${id}/status`, { status, comment })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update status')
    }
  }
)

export const assignIncident = createAsyncThunk(
  'incidents/assignIncident',
  async ({ id, userId }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/incidents/${id}/assign`, { user_id: userId })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign incident')
    }
  }
)

export const fetchDashboardStats = createAsyncThunk(
  'incidents/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/dashboard')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard stats')
    }
  }
)

// Initial state
const initialState = {
  incidents: [],
  currentIncident: null,
  dashboardStats: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 15
  },
  loading: false,
  error: null,
  filters: {
    status: '',
    severity: '',
    assigned_to: ''
  }
}

// Slice
const incidentSlice = createSlice({
  name: 'incidents',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = initialState.filters
    },
    clearCurrentIncident: (state) => {
      state.currentIncident = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Incidents
      .addCase(fetchIncidents.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchIncidents.fulfilled, (state, action) => {
        state.loading = false
        state.incidents = action.payload.data || []
        state.pagination = {
          currentPage: action.payload.current_page || 1,
          totalPages: action.payload.last_page || 1,
          totalItems: action.payload.total || 0,
          perPage: action.payload.per_page || 15
        }
      })
      .addCase(fetchIncidents.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Fetch Single Incident
      .addCase(fetchIncident.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchIncident.fulfilled, (state, action) => {
        state.loading = false
        state.currentIncident = action.payload
      })
      .addCase(fetchIncident.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Create Incident
      .addCase(createIncident.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createIncident.fulfilled, (state, action) => {
        state.loading = false
        state.incidents = [action.payload, ...state.incidents]
      })
      .addCase(createIncident.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Update Status
      .addCase(updateIncidentStatus.fulfilled, (state, action) => {
        if (state.currentIncident && state.currentIncident.id === action.payload.id) {
          state.currentIncident = action.payload
        }
        const index = state.incidents.findIndex(i => i.id === action.payload.id)
        if (index !== -1) {
          state.incidents[index] = action.payload
        }
      })

      // Assign Incident
      .addCase(assignIncident.fulfilled, (state, action) => {
        if (state.currentIncident && state.currentIncident.id === action.payload.id) {
          state.currentIncident = action.payload
        }
        const index = state.incidents.findIndex(i => i.id === action.payload.id)
        if (index !== -1) {
          state.incidents[index] = action.payload
        }
      })

      // Dashboard Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false
        state.dashboardStats = action.payload
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { clearError, setFilters, clearFilters, clearCurrentIncident } = incidentSlice.actions
export default incidentSlice.reducer