/**
 * Authentication Utilities for the Broker Admin Dashboard
 * 
 * This file contains functions for user authentication.
 * In a frontend-only app, we're using localStorage for persistence.
 */

// Constants
const AUTH_TOKEN_KEY = 'broker_admin_auth_token';
const AUTH_USER_KEY = 'broker_admin_auth_user';

/**
 * Check if user is authenticated, redirect to login if not
 * @returns {boolean} Authentication status
 */
function checkAuth() {
    const isAuthenticated = !!localStorage.getItem(AUTH_TOKEN_KEY);
    
    // If not authenticated and not already on the login page, redirect to login
    if (!isAuthenticated && !window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
        return false;
    }
    
    // If authenticated and on login page, redirect to dashboard
    if (isAuthenticated && window.location.pathname.includes('login.html')) {
        window.location.href = 'index.html';
        return true;
    }
    
    return isAuthenticated;
}

/**
 * Attempt to login a user
 * @param {string} username - Username to login with
 * @param {string} password - Password to login with
 * @returns {Object|null} Authenticated user or null if login failed
 */
function login(username, password) {
    // For admin login
    if (username === 'admin' && password === 'admin123') {
        const adminUser = {
            id: 0,
            username: 'admin',
            fullName: 'John Doe',
            role: 'admin'
        };
        
        // Save auth token and user info in local storage
        localStorage.setItem(AUTH_TOKEN_KEY, 'admin_token_' + Date.now());
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(adminUser));
        
        return adminUser;
    }
    
    // For regular user login
    const user = getUserByUsername(username);
    
    if (user && user.password === password) {
        const authUser = {
            id: user.id,
            username: user.username,
            fullName: user.fullName,
            role: 'user'
        };
        
        // Save auth token and user info in local storage
        localStorage.setItem(AUTH_TOKEN_KEY, 'user_token_' + Date.now());
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
        
        return authUser;
    }
    
    return null;
}

/**
 * Log out the current user
 */
function logout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    window.location.href = 'login.html';
}

/**
 * Get the current authenticated user
 * @returns {Object|null} Current user or null if not authenticated
 */
function getCurrentUser() {
    const userJson = localStorage.getItem(AUTH_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
}

/**
 * Initialize authentication on page load
 */
function initAuth() {
    // Check authentication status
    checkAuth();
    
    // Update user display if authenticated
    if (checkAuth()) {
        const currentUser = getCurrentUser();
        
        // Update user display in the header if elements exist
        const userInitialsElement = document.getElementById('user-initials');
        const userNameElement = document.getElementById('user-name');
        
        if (userInitialsElement && currentUser) {
            userInitialsElement.textContent = getInitials(currentUser.fullName);
        }
        
        if (userNameElement && currentUser) {
            userNameElement.textContent = currentUser.fullName;
        }
        
        // Set up logout button event listener
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', logout);
        }
    }
}

// Initialize auth when DOM is loaded
document.addEventListener('DOMContentLoaded', initAuth);