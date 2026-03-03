import React from 'react'
import { format } from 'date-fns'
import StatusBadge from './StatusBadge'

const IncidentCard = ({ incident, onClick }) => {
  const severityColors = {
    low: 'border-l-4 border-l-green-500',
    medium: 'border-l-4 border-l-yellow-500',
    high: 'border-l-4 border-l-orange-500',
    critical: 'border-l-4 border-l-red-500'
  }

  const severityBgColors = {
    low: 'bg-green-50',
    medium: 'bg-yellow-50',
    high: 'bg-orange-50',
    critical: 'bg-red-50'
  }

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer 
        ${severityColors[incident.severity] || 'border-l-4 border-l-gray-500'}
        ${severityBgColors[incident.severity] || ''}`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{incident.title}</h3>
              <StatusBadge status={incident.status} />
            </div>
            
            <p className="text-gray-600 mb-3 line-clamp-2">
              {incident.description}
            </p>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <span className="font-medium">Reported by:</span>
                <span>{incident.reporter?.name || 'Unknown'}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <span className="font-medium">Assigned to:</span>
                <span>{incident.assigned_to?.name || 'Unassigned'}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <span className="font-medium">Created:</span>
                <span>{format(new Date(incident.created_at), 'MMM dd, yyyy')}</span>
              </div>
            </div>
          </div>

          <div className="ml-4 flex flex-col items-end gap-2">
            <span className={`text-xs font-medium px-2 py-1 rounded-full
              ${incident.severity === 'critical' ? 'bg-red-200 text-red-800' :
                incident.severity === 'high' ? 'bg-orange-200 text-orange-800' :
                incident.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                'bg-green-200 text-green-800'}`}
            >
              {incident.severity.toUpperCase()}
            </span>
            
            {incident.updates && incident.updates.length > 0 && (
              <span className="text-xs text-gray-400">
                {incident.updates.length} update{incident.updates.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default IncidentCard