// Authentication handling

/**
 * Current authenticated user
 * @type {Object|null}
 */
let currentUser = null;

/**
 * Check if user is authenticated, redirect to login if not
 * @returns {Promise<boolean>} - Promise resolving to authenticated status
 */
async function checkAuth() {
  try {
    // For demo purposes, we'll use a hardcoded admin user
    // In a real app, this would be an API call to verify session
    if (!currentUser) {
      currentUser = {
        id: 0,
        username: 'admin',
        name: 'Admin User',
        role: 'admin'
      };
      
      // If on login page and already authenticated, redirect to dashboard
      if (window.location.pathname === '/login.html') {
        window.location.href = '/';
        return true;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Authentication check failed:', error);
    
    // If not on login page and not authenticated, redirect to login
    if (window.location.pathname !== '/login.html') {
      window.location.href = '/login.html';
    }
    
    return false;
  }
}

/**
 * Attempt to login a user
 * @param {string} username - Username to login with
 * @param {string} password - Password to login with
 * @returns {Promise<Object>} - Promise resolving to the authenticated user
 */
async function login(username, password) {
  try {
    // In a real app, this would be a POST request to /api/auth/login
    // For demo purposes, we'll just check hardcoded credentials
    if (username === 'admin' && password === 'password') {
      currentUser = {
        id: 0,
        username: 'admin',
        name: 'Admin User',
        role: 'admin'
      };
      
      return currentUser;
    } else {
      throw new Error('Invalid username or password');
    }
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

/**
 * Logout the current user
 */
function logout() {
  // In a real app, this would be a POST request to /api/auth/logout
  currentUser = null;
  window.location.href = '/login.html';
}

/**
 * Get the current authenticated user
 * @returns {Object|null} - The current user or null if not authenticated
 */
function getCurrentUser() {
  return currentUser;
}

// Setup logout button click handler
document.addEventListener('DOMContentLoaded', function() {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
  
  // Check authentication on page load
  checkAuth();
});