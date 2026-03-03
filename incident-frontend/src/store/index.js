import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import incidentReducer from './incidentSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    incidents: incidentReducer,
  },
})