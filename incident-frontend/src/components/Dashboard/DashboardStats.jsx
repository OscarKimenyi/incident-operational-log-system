import React from 'react'
import { Link } from 'react-router-dom'

const DashboardStats = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-8 bg-gray-300 rounded w-16"></div>
          </div>
        ))}
      </div>
    )
  }

  const statCards = [
    {
      title: 'Open Incidents',
      value: stats?.open || 0,
      color: 'yellow',
      icon: '🟡',
      link: '/incidents?status=open'
    },
    {
      title: 'Investigating',
      value: stats?.investigating || 0,
      color: 'blue',
      icon: '🔵',
      link: '/incidents?status=investigating'
    },
    {
      title: 'Resolved',
      value: stats?.resolved || 0,
      color: 'green',
      icon: '🟢',
      link: '/incidents?status=resolved'
    },
    {
      title: 'Closed',
      value: stats?.closed || 0,
      color: 'gray',
      icon: '⚫',
      link: '/incidents?status=closed'
    }
  ]

  const colorClasses = {
    yellow: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
      hover: 'hover:bg-yellow-100'
    },
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      hover: 'hover:bg-blue-100'
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
      hover: 'hover:bg-green-100'
    },
    gray: {
      bg: 'bg-gray-50',
      text: 'text-gray-700',
      border: 'border-gray-200',
      hover: 'hover:bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className={`block ${colorClasses[card.color].bg} rounded-lg shadow-sm border ${colorClasses[card.color].border} ${colorClasses[card.color].hover} transition p-6`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                <p className={`text-3xl font-bold ${colorClasses[card.color].text}`}>
                  {card.value}
                </p>
              </div>
              <span className="text-3xl opacity-50">{card.icon}</span>
            </div>
          </Link>
        ))}
      </div>

      {stats?.total > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Incidents</span>
              <span className="font-semibold text-gray-900">{stats.total}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${(stats.resolved / stats.total) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-green-600">{stats.resolved} Resolved</span>
              <span className="text-yellow-600">{stats.open + stats.investigating} Active</span>
              <span className="text-gray-600">{stats.closed} Closed</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardStats