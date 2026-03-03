import React, { useState } from 'react'
import IncidentCard from './IncidentCard'
import StatusBadge from './StatusBadge'

const IncidentList = ({ incidents, loading, onIncidentClick }) => {
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!incidents || incidents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No incidents found</p>
        <p className="text-gray-400 mt-2">Create a new incident to get started</p>
      </div>
    )
  }

  // Filter incidents
  const filteredIncidents = filter === 'all' 
    ? incidents 
    : incidents.filter(inc => inc.status === filter)

  // Sort incidents
  const sortedIncidents = [...filteredIncidents].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.created_at) - new Date(a.created_at)
    }
    if (sortBy === 'oldest') {
      return new Date(a.created_at) - new Date(b.created_at)
    }
    if (sortBy === 'severity') {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
      return severityOrder[b.severity] - severityOrder[a.severity]
    }
    return 0
  })

  return (
    <div className="space-y-4">
      {/* Filters and Sort */}
      <div className="bg-white p-4 rounded-lg shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === 'all' 
                ? 'bg-gray-800 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('open')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === 'open' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
            }`}
          >
            Open
          </button>
          <button
            onClick={() => setFilter('investigating')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === 'investigating' 
                ? 'bg-blue-600 text-white' 
                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
            }`}
          >
            Investigating
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === 'resolved' 
                ? 'bg-green-600 text-white' 
                : 'bg-green-100 text-green-800 hover:bg-green-200'
            }`}
          >
            Resolved
          </button>
          <button
            onClick={() => setFilter('closed')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === 'closed' 
                ? 'bg-gray-600 text-white' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Closed
          </button>
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="severity">Severity (Highest)</option>
        </select>
      </div>

      {/* Incident Cards */}
      <div className="space-y-3">
        {sortedIncidents.map((incident) => (
          <IncidentCard
            key={incident.id}
            incident={incident}
            onClick={() => onIncidentClick(incident.id)}
          />
        ))}
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-500 mt-4">
        Showing {sortedIncidents.length} of {incidents.length} incidents
      </div>
    </div>
  )
}

export default IncidentList