import React from 'react'

const StatusBadge = ({ status, size = 'medium' }) => {
  const statusConfig = {
    open: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      label: 'Open',
      icon: '🟡'
    },
    investigating: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      label: 'Investigating',
      icon: '🔵'
    },
    resolved: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'Resolved',
      icon: '🟢'
    },
    closed: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      label: 'Closed',
      icon: '⚫'
    }
  }

  const config = statusConfig[status] || statusConfig.open

  const sizeClasses = {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-2.5 py-1 text-sm',
    large: 'px-3 py-1.5 text-base'
  }

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${config.bg} ${config.text} ${sizeClasses[size]}`}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  )
}

export default StatusBadge