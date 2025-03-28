/**
 * Authentication functionality for the Broker Admin Dashboard
 * 
 * This file handles user authentication and session management.
 */

// Current authenticated user storage key
const AUTH_USER_KEY = 'broker_admin_user';

/**
 * Check if user is authenticated, redirect to login if not
 * @returns {boolean} Authentication status
 */
function checkAuth() {
    const currentPath = window.location.pathname;
    const isLoginPage = currentPath.includes('login.html');
    const currentUser = getCurrentUser();
    
    if (!currentUser && !isLoginPage) {
        // User is not authenticated and not on login page, redirect to login
        window.location.href = 'login.html';
        return false;
    } else if (currentUser && isLoginPage) {
        // User is authenticated and on login page, redirect to dashboard
        window.location.href = 'index.html';
        return true;
    }
    
    // Update UI based on authenticated user if available
    if (currentUser && !isLoginPage) {
        updateAuthUI(currentUser);
    }
    
    return !!currentUser;
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
        // Create a copy of the user without the password field for storage
        const safeUser = { ...user };
        delete safeUser.password;
        
        // Store authenticated user in session
        sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(safeUser));
        return safeUser;
    }
    
    return null;
}

/**
 * Log out the current user
 */
function logout() {
    sessionStorage.removeItem(AUTH_USER_KEY);
    window.location.href = 'login.html';
}

/**
 * Get the current authenticated user
 * @returns {Object|null} Current user or null if not authenticated
 */
function getCurrentUser() {
    const userJson = sessionStorage.getItem(AUTH_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
}

/**
 * Update UI elements based on current authenticated user
 * @param {Object} user - The authenticated user
 */
function updateAuthUI(user) {
    // Update username display
    const usernameElements = document.querySelectorAll('.user-name');
    usernameElements.forEach(el => {
        if (el) el.textContent = user.fullName;
    });
    
    // Update user avatar with initials
    const avatarElements = document.querySelectorAll('.user-avatar');
    avatarElements.forEach(el => {
        if (el) el.textContent = getInitials(user.fullName);
    });
    
    // Add logout functionality
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
    checkAuth();
}

// Run authentication check on all pages except login
if (!window.location.pathname.includes('login.html')) {
    document.addEventListener('DOMContentLoaded', initAuth);
}