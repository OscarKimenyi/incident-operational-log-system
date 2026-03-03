import React, { useState, useEffect } from 'react'

const IncidentForm = ({ initialData = {}, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium',
    ...initialData
  })

  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    }
    return newErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`w-full border rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Brief summary of the incident"
          disabled={loading}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">
          Severity
        </label>
        <select
          id="severity"
          name="severity"
          value={formData.severity}
          onChange={handleChange}
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          disabled={loading}
        >
          <option value="low">Low - Minor issue, no immediate impact</option>
          <option value="medium">Medium - Affects some users</option>
          <option value="high">High - Major feature/service affected</option>
          <option value="critical">Critical - System down/data loss</option>
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows="6"
          value={formData.description}
          onChange={handleChange}
          className={`w-full border rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Detailed description of the incident including steps to reproduce, impact, etc."
          disabled={loading}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Minimum 10 characters. {formData.description.length}/5000
        </p>
      </div>

      <div className="flex items-center space-x-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save Incident'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default IncidentForm