/**
 * Authentication JavaScript for the Broker Admin Dashboard
 * 
 * This file contains functions for user authentication and session management.
 */

// Storage key for the authenticated user
const AUTH_USER_KEY = 'broker_admin_auth_user';

/**
 * Check if user is authenticated, redirect to login if not
 * @returns {boolean} Authentication status
 */
function checkAuth() {
    const auth = localStorage.getItem(AUTH_USER_KEY);
    
    if (!auth) {
        // Not logged in, redirect to login page
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
        }
        return false;
    }
    
    // Check if on login page but already authenticated
    if (window.location.pathname.includes('login.html')) {
        window.location.href = 'index.html';
        return true;
    }
    
    // Update UI with current user
    updateAuthUI(JSON.parse(auth));
    return true;
}

/**
 * Attempt to login a user
 * @param {string} username - Username to login with
 * @param {string} password - Password to login with
 * @returns {Object|null} Authenticated user or null if login failed
 */
function login(username, password) {
    const user = getUserByUsername(username);
    
    if (user && user.password === password) {
        // Create auth user object (exclude password)
        const authUser = {
            id: user.id,
            username: user.username,
            fullName: user.fullName,
            email: user.email,
            role: user.role
        };
        
        // Store in local storage
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
        
        return authUser;
    }
    
    return null;
}

/**
 * Log out the current user
 */
function logout() {
    localStorage.removeItem(AUTH_USER_KEY);
    window.location.href = 'login.html';
}

/**
 * Get the current authenticated user
 * @returns {Object|null} Current user or null if not authenticated
 */
function getCurrentUser() {
    const auth = localStorage.getItem(AUTH_USER_KEY);
    return auth ? JSON.parse(auth) : null;
}

/**
 * Update UI elements based on current authenticated user
 * @param {Object} user - The authenticated user
 */
function updateAuthUI(user) {
    // Set user avatar and info
    const avatarElements = document.querySelectorAll('.user-avatar');
    const userNameElements = document.querySelectorAll('.user-name');
    const userRoleElements = document.querySelectorAll('.user-role');
    
    // Get initials for avatar
    const initials = getInitials(user.fullName);
    
    // Update elements
    avatarElements.forEach(el => {
        el.textContent = initials;
    });
    
    userNameElements.forEach(el => {
        el.textContent = user.fullName;
    });
    
    userRoleElements.forEach(el => {
        el.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    });
    
    // Set up logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
}

/**
 * Initialize authentication on page load
 */
function initAuth() {
    // Skip auth check for login page
    if (window.location.pathname.includes('login.html')) {
        return;
    }
    
    // Check authentication
    checkAuth();
}

// Initialize auth when DOM is loaded
document.addEventListener('DOMContentLoaded', initAuth);