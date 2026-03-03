import React from 'react'
import { format } from 'date-fns'
import StatusBadge from './StatusBadge'

const IncidentDetails = ({ incident, onStatusUpdate, onAssign, userRole }) => {
  const severityColors = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    critical: 'bg-red-100 text-red-800 border-red-200'
  }

  const nextStatus = {
    open: { status: 'investigating', label: 'Start Investigation' },
    investigating: { status: 'resolved', label: 'Mark as Resolved' },
    resolved: { status: 'closed', label: 'Close Incident' },
    closed: null
  }

  const canUpdate = ['admin', 'operator'].includes(userRole) && incident.status !== 'closed'
  const nextAction = nextStatus[incident.status]

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{incident.title}</h1>
            <div className="flex items-center gap-3">
              <StatusBadge status={incident.status} size="large" />
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${severityColors[incident.severity]}`}>
                {incident.severity.toUpperCase()} SEVERITY
              </span>
            </div>
          </div>
          
          {canUpdate && nextAction && (
            <button
              onClick={() => onStatusUpdate(nextAction.status)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              {nextAction.label}
            </button>
          )}
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div>
            <p className="text-sm text-gray-500">Reported By</p>
            <p className="font-medium">{incident.reporter?.name || 'Unknown'}</p>
            <p className="text-xs text-gray-400">{incident.reporter?.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Assigned To</p>
            <p className="font-medium">{incident.assigned_to?.name || 'Unassigned'}</p>
            {incident.assigned_to && (
              <p className="text-xs text-gray-400">{incident.assigned_to.email}</p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-500">Created</p>
            <p className="font-medium">{format(new Date(incident.created_at), 'MMM dd, yyyy')}</p>
            <p className="text-xs text-gray-400">{format(new Date(incident.created_at), 'hh:mm a')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="font-medium">{format(new Date(incident.updated_at), 'MMM dd, yyyy')}</p>
            <p className="text-xs text-gray-400">{format(new Date(incident.updated_at), 'hh:mm a')}</p>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
        <p className="text-gray-700 whitespace-pre-wrap">{incident.description}</p>
      </div>

      {/* Assignment Section for Admins */}
      {userRole === 'admin' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Assignment</h2>
          <div className="flex items-center gap-4">
            <select
              onChange={(e) => onAssign(e.target.value)}
              className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              defaultValue={incident.assigned_to?.id || ''}
            >
              <option value="">Select an operator...</option>
              {/* Options would be populated from props */}
            </select>
            <button
              onClick={() => onAssign(document.querySelector('select').value)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            >
              Assign
            </button>
          </div>
        </div>
      )}

      {/* Updates/Activity Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h2>
        
        {canUpdate && (
          <div className="mb-6">
            <textarea
              placeholder="Add a comment or update..."
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              rows="3"
            />
            <div className="mt-2 flex justify-end">
              <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition">
                Add Comment
              </button>
            </div>
          </div>
        )}

        <div className="flow-root">
          <ul className="-mb-8">
            {incident.updates?.map((update, index) => (
              <li key={update.id}>
                <div className="relative pb-8">
                  {index < incident.updates.length - 1 && (
                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                  )}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {update.user?.name?.charAt(0) || 'U'}
                        </span>
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-900">{update.user?.name}</span>
                          <span className="text-gray-500"> updated status from </span>
                          <span className="font-medium text-gray-900">{update.old_status}</span>
                          <span className="text-gray-500"> to </span>
                          <span className="font-medium text-gray-900">{update.new_status}</span>
                        </div>
                        <p className="mt-0.5 text-xs text-gray-500">
                          {format(new Date(update.created_at), 'MMM dd, yyyy hh:mm a')}
                        </p>
                      </div>
                      {update.comment && (
                        <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-3 rounded">
                          {update.comment}
                        </div>
                      )}
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
                    <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {incident.reporter?.name?.charAt(0) || 'R'}
                      </span>
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-900">{incident.reporter?.name}</span>
                        <span className="text-gray-500"> created this incident</span>
                      </div>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {format(new Date(incident.created_at), 'MMM dd, yyyy hh:mm a')}
                      </p>
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

export default IncidentDetails