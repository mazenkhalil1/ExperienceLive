export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  EVENT_DETAILS: '/events/:id',
  
  // Protected routes
  PROFILE: '/profile',
  BOOKINGS: '/bookings',
  BOOKING_DETAILS: '/bookings/:id',
  
  // Admin routes
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    EVENTS: '/admin/events',
  },
  
  // Organizer routes
  ORGANIZER: {
    ROOT: '/organizer',
    EVENTS: '/organizer/events',
    NEW_EVENT: '/organizer/events/new',
    EDIT_EVENT: '/organizer/events/edit/:id',
    ANALYTICS: '/organizer/analytics',
  },
  
  // User routes
  MY_EVENTS: '/my-events',
  
  // System routes
  UNAUTHORIZED: '/unauthorized',
  NOT_FOUND: '*',
}; 