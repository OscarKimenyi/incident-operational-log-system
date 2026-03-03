import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '../services/api'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const IncidentDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [incident, setIncident] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [comment, setComment] = useState('')
  const [assignUserId, setAssignUserId] = useState('')
  const [operators, setOperators] = useState([])

  useEffect(() => {
    fetchIncident()
    if (user.role === 'admin') {
      fetchOperators()
    }
  }, [id])

  const fetchIncident = async () => {
    try {
      const response = await api.get(`/incidents/${id}`)
      setIncident(response.data)
    } catch (error) {
      console.error('Failed to fetch incident:', error)
      toast.error('Failed to load incident')
      navigate('/incidents')
    } finally {
      setLoading(false)
    }
  }

  const fetchOperators = async () => {
    try {
      const response = await api.get('/users?role=operator')
      setOperators(response.data)
    } catch (error) {
      console.error('Failed to fetch operators:', error)
    }
  }

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true)
    try {
      await api.post(`/incidents/${id}/status`, {
        status: newStatus,
        comment: comment
      })
      toast.success('Status updated successfully')
      setComment('')
      fetchIncident()
    } catch (error) {
      console.error('Failed to update status:', error)
      toast.error(error.response?.data?.message || 'Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  const handleAssign = async () => {
    if (!assignUserId) return
    
    setUpdating(true)
    try {
      await api.post(`/incidents/${id}/assign`, {
        user_id: assignUserId
      })
      toast.success('Incident assigned successfully')
      setAssignUserId('')
      fetchIncident()
    } catch (error) {
      console.error('Failed to assign incident:', error)
      toast.error('Failed to assign incident')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (!incident) {
    return (
      <div className="text-center py-12 text-gray-500">Incident not found</div>
    )
  }

  const statusColors = {
    open: 'bg-yellow-100 text-yellow-800',
    investigating: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800',
  }

  const severityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800',
  }

  const nextStatus = {
    open: 'investigating',
    investigating: 'resolved',
    resolved: 'closed',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Incident Details</h1>
        <button
          onClick={() => navigate('/incidents')}
          className="text-gray-600 hover:text-gray-900"
        >
          ← Back to Incidents
        </button>
      </div>

      {/* Incident Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">{incident.title}</h2>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
              severityColors[incident.severity]
            }`}>
              {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}
            </span>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
              statusColors[incident.status]
            }`}>
              {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p className="mt-1 text-gray-900 whitespace-pre-wrap">{incident.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Reported By</h3>
              <p className="mt-1 text-gray-900">{incident.reporter?.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Assigned To</h3>
              <p className="mt-1 text-gray-900">
                {incident.assigned_to ? incident.assigned_to.name : 'Unassigned'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Created</h3>
              <p className="mt-1 text-gray-900">
                {format(new Date(incident.created_at), 'MMM dd, yyyy HH:mm')}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
              <p className="mt-1 text-gray-900">
                {format(new Date(incident.updated_at), 'MMM dd, yyyy HH:mm')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Update (for operators and admins) */}
      {(user.role === 'admin' || user.role === 'operator') && incident.status !== 'closed' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Update Status</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comment (optional)
              </label>
              <textarea
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add a comment about this status update..."
              />
            </div>
            <div>
              <button
                onClick={() => handleStatusUpdate(nextStatus[incident.status])}
                disabled={updating || !nextStatus[incident.status]}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              >
                {updating ? 'Updating...' : `Mark as ${nextStatus[incident.status]?.charAt(0).toUpperCase() + nextStatus[incident.status]?.slice(1)}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assignment (for admins only) */}
      {user.role === 'admin' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Assign Incident</h3>
          <div className="flex space-x-4">
            <select
              value={assignUserId}
              onChange={(e) => setAssignUserId(e.target.value)}
              className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select an operator...</option>
              {operators.map(op => (
                <option key={op.id} value={op.id}>{op.name}</option>
              ))}
            </select>
            <button
              onClick={handleAssign}
              disabled={updating || !assignUserId}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition disabled:opacity-50"
            >
              {updating ? 'Assigning...' : 'Assign'}
            </button>
          </div>
        </div>
      )}

      {/* Activity Timeline */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Timeline</h3>
        <div className="flow-root">
          <ul className="-mb-8">
            {incident.updates?.map((update, index) => (
              <li key={update.id}>
                <div className="relative pb-8">
                  {index < incident.updates.length - 1 && (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  )}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                        <span className="text-white text-sm font-medium">
                          {update.user?.name?.charAt(0) || 'U'}
                        </span>
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium text-gray-900">{update.user?.name}</span>{' '}
                          updated status from{' '}
                          <span className="font-medium">{update.old_status}</span> to{' '}
                          <span className="font-medium">{update.new_status}</span>
                        </p>
                        {update.comment && (
                          <p className="mt-1 text-sm text-gray-700">{update.comment}</p>
                        )}
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        {format(new Date(update.created_at), 'MMM dd, HH:mm')}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
            {/* Initial creation */}
            <li>
              <div className="relative pb-8">
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                      <span className="text-white text-sm font-medium">
                        {incident.reporter?.name?.charAt(0) || 'R'}
                      </span>
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium text-gray-900">{incident.reporter?.name}</span>{' '}
                        created this incident
                      </p>
                    </div>
                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                      {format(new Date(incident.created_at), 'MMM dd, HH:mm')}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default IncidentDetail