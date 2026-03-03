// src/App.jsx
import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Toaster } from 'react-hot-toast'

// Pages
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Incidents from './pages/Incidents'
import IncidentDetail from './pages/IncidentDetail'
import CreateIncident from './pages/CreateIncident'

// Components
import Layout from './components/Layout/Layout'
import LoadingSpinner from './components/LoadingSpinner'

// Redux actions
import { getCurrentUser } from './store/authSlice'

// Protected Route wrapper component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  
  console.log('🔒 ProtectedRoute Check:', { 
    isAuthenticated, 
    userRole: user?.role,
    allowedRoles,
    path: window.location.pathname 
  })

  useEffect(() => {
    if (!isAuthenticated) {
      console.log('Not authenticated, redirecting to login')
      navigate('/login', { replace: true })
    }
  }, [isAuthenticated, navigate])

  // Show nothing while checking authentication
  if (!isAuthenticated) {
    return null
  }

  // Check role-based access
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    console.log('Role not allowed, redirecting to dashboard')
    navigate('/dashboard', { replace: true })
    return null
  }

  console.log('✅ Access granted to protected route')
  return children
}

// Public route wrapper (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      console.log('👤 User already authenticated, redirecting to dashboard')
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  if (isAuthenticated) {
    return null
  }

  return children
}

function App() {
  const dispatch = useDispatch()
  const [initialLoading, setInitialLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)

  // Check authentication status on app load
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token')
      console.log('🔑 Initial auth check - Token exists:', !!token)
      
      if (token) {
        try {
          console.log('🔄 Fetching current user...')
          await dispatch(getCurrentUser()).unwrap()
          console.log('✅ User authenticated successfully')
        } catch (error) {
          console.error('Failed to get current user:', error)
          // Clear invalid token
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      } else {
        console.log('ℹNo token found, user not authenticated')
      }
      
      setAuthChecked(true)
      setInitialLoading(false)
    }
    
    initAuth()
  }, [dispatch])

  // Show loading spinner while checking authentication
  if (initialLoading) {
    console.log('⏳ App initializing...')
    return <LoadingSpinner />
  }

  console.log('App ready, auth checked:', authChecked)

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />

        {/* Protected Routes - Require Authentication */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Default redirect to dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          {/* Dashboard - Accessible by all authenticated users */}
          <Route 
            path="dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Incidents List - Accessible by all authenticated users */}
          <Route 
            path="incidents" 
            element={
              <ProtectedRoute>
                <Incidents />
              </ProtectedRoute>
            } 
          />
          
          {/* Incident Details - Accessible by all authenticated users */}
          <Route 
            path="incidents/:id" 
            element={
              <ProtectedRoute>
                <IncidentDetail />
              </ProtectedRoute>
            } 
          />
          
          {/* Create Incident - Only Admin and Reporter */}
          <Route 
            path="incidents/create" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'reporter']}>
                <CreateIncident />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* 404 - Not Found - Redirect to dashboard or login */}
        <Route 
          path="*" 
          element={
            <Navigate to="/" replace />
          } 
        />
      </Routes>
    </>
  )
}

export default App