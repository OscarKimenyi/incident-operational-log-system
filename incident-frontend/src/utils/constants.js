export const ROLES = {
    ADMIN: 'admin',
    OPERATOR: 'operator',
    REPORTER: 'reporter'
  }
  
  export const INCIDENT_STATUS = {
    OPEN: 'open',
    INVESTIGATING: 'investigating',
    RESOLVED: 'resolved',
    CLOSED: 'closed'
  }
  
  export const INCIDENT_SEVERITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical'
  }
  
  export const STATUS_FLOW = {
    [INCIDENT_STATUS.OPEN]: [INCIDENT_STATUS.INVESTIGATING],
    [INCIDENT_STATUS.INVESTIGATING]: [INCIDENT_STATUS.RESOLVED],
    [INCIDENT_STATUS.RESOLVED]: [INCIDENT_STATUS.CLOSED],
    [INCIDENT_STATUS.CLOSED]: []
  }
  
  export const STATUS_LABELS = {
    [INCIDENT_STATUS.OPEN]: 'Open',
    [INCIDENT_STATUS.INVESTIGATING]: 'Investigating',
    [INCIDENT_STATUS.RESOLVED]: 'Resolved',
    [INCIDENT_STATUS.CLOSED]: 'Closed'
  }
  
  export const SEVERITY_LABELS = {
    [INCIDENT_SEVERITY.LOW]: 'Low',
    [INCIDENT_SEVERITY.MEDIUM]: 'Medium',
    [INCIDENT_SEVERITY.HIGH]: 'High',
    [INCIDENT_SEVERITY.CRITICAL]: 'Critical'
  }
  
  export const STATUS_COLORS = {
    [INCIDENT_STATUS.OPEN]: 'yellow',
    [INCIDENT_STATUS.INVESTIGATING]: 'blue',
    [INCIDENT_STATUS.RESOLVED]: 'green',
    [INCIDENT_STATUS.CLOSED]: 'gray'
  }
  
  export const SEVERITY_COLORS = {
    [INCIDENT_SEVERITY.LOW]: 'green',
    [INCIDENT_SEVERITY.MEDIUM]: 'yellow',
    [INCIDENT_SEVERITY.HIGH]: 'orange',
    [INCIDENT_SEVERITY.CRITICAL]: 'red'
  }
  
  export const API_ENDPOINTS = {
    LOGIN: '/login',
    LOGOUT: '/logout',
    ME: '/me',
    INCIDENTS: '/incidents',
    DASHBOARD: '/dashboard'
  }
  
  export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_PER_PAGE: 15,
    PER_PAGE_OPTIONS: [10, 15, 25, 50, 100]
  }
  
  export const DATE_FORMATS = {
    DISPLAY: 'MMM dd, yyyy',
    DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
    API: 'yyyy-MM-dd HH:mm:ss',
    TIME: 'HH:mm',
    TIME_WITH_SECONDS: 'HH:mm:ss'
  }
  
  export const VALIDATION_RULES = {
    TITLE_MIN_LENGTH: 3,
    TITLE_MAX_LENGTH: 255,
    DESCRIPTION_MIN_LENGTH: 10,
    DESCRIPTION_MAX_LENGTH: 5000
  }
  
  export const ERROR_MESSAGES = {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters',
    TITLE_REQUIRED: 'Title is required',
    DESCRIPTION_REQUIRED: 'Description is required',
    DESCRIPTION_MIN: `Description must be at least ${VALIDATION_RULES.DESCRIPTION_MIN_LENGTH} characters`,
    INVALID_STATUS_TRANSITION: 'Invalid status transition',
    UNAUTHORIZED: 'You are not authorized to perform this action',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    SESSION_EXPIRED: 'Your session has expired. Please login again.'
  }
  
  export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: 'Successfully logged in',
    LOGOUT_SUCCESS: 'Successfully logged out',
    INCIDENT_CREATED: 'Incident created successfully',
    INCIDENT_UPDATED: 'Incident updated successfully',
    STATUS_UPDATED: 'Status updated successfully',
    INCIDENT_ASSIGNED: 'Incident assigned successfully'
  }
  
  export const ROUTES = {
    LOGIN: '/login',
    DASHBOARD: '/dashboard',
    INCIDENTS: '/incidents',
    INCIDENT_DETAIL: (id) => `/incidents/${id}`,
    CREATE_INCIDENT: '/incidents/create'
  }
  
  export const PERMISSIONS = {
    [ROLES.ADMIN]: {
      canCreateIncident: true,
      canUpdateStatus: true,
      canAssignIncident: true,
      canViewAllIncidents: true,
      canManageUsers: true
    },
    [ROLES.OPERATOR]: {
      canCreateIncident: false,
      canUpdateStatus: true,
      canAssignIncident: false,
      canViewAllIncidents: true,
      canManageUsers: false
    },
    [ROLES.REPORTER]: {
      canCreateIncident: true,
      canUpdateStatus: false,
      canAssignIncident: false,
      canViewAllIncidents: false,
      canManageUsers: false
    }
  }