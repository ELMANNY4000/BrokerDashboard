// API Handling Functions

/**
 * Base API request function for making HTTP requests to the backend
 * @param {string} url - The API endpoint URL
 * @param {object} options - Fetch options including method, headers, and body
 * @returns {Promise<any>} - Promise resolving to the JSON response
 */
async function apiRequest(url, options = {}) {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  const requestOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, requestOptions);
    
    if (!response.ok) {
      // If the response status is 401 Unauthorized, redirect to login
      if (response.status === 401) {
        window.location.href = '/login.html';
        return null;
      }
      
      const errorData = await response.json().catch(() => ({
        message: response.statusText || 'An error occurred',
      }));
      
      throw new Error(errorData.message || 'API request failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    showToast('error', error.message || 'Failed to connect to the server');
    throw error;
  }
}

// User API Functions

/**
 * Fetch all users from the API
 * @returns {Promise<Array>} - Promise resolving to an array of users
 */
async function getUsers() {
  return apiRequest('/api/users');
}

/**
 * Fetch a specific user by ID
 * @param {number} userId - The user ID to fetch
 * @returns {Promise<Object>} - Promise resolving to the user object
 */
async function getUserById(userId) {
  return apiRequest(`/api/users/${userId}`);
}

/**
 * Create a new user
 * @param {Object} userData - User data to create
 * @returns {Promise<Object>} - Promise resolving to the created user
 */
async function createUser(userData) {
  return apiRequest('/api/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

// Transaction API Functions

/**
 * Fetch all transactions
 * @returns {Promise<Array>} - Promise resolving to an array of transactions
 */
async function getTransactions() {
  return apiRequest('/api/transactions');
}

/**
 * Fetch transactions for a specific user
 * @param {number} userId - The user ID to fetch transactions for
 * @returns {Promise<Array>} - Promise resolving to an array of transactions
 */
async function getUserTransactions(userId) {
  return apiRequest(`/api/users/${userId}/transactions`);
}

/**
 * Create a new transaction
 * @param {Object} transactionData - Transaction data to create
 * @returns {Promise<Object>} - Promise resolving to the created transaction
 */
async function createTransaction(transactionData) {
  return apiRequest('/api/transactions', {
    method: 'POST',
    body: JSON.stringify(transactionData),
  });
}

// Email Notifications API Functions

/**
 * Fetch all email notifications
 * @returns {Promise<Array>} - Promise resolving to an array of email notifications
 */
async function getEmailNotifications() {
  return apiRequest('/api/email-notifications');
}

/**
 * Create a new email notification
 * @param {Object} emailData - Email notification data to create
 * @returns {Promise<Object>} - Promise resolving to the created email notification
 */
async function createEmailNotification(emailData) {
  return apiRequest('/api/email-notifications', {
    method: 'POST',
    body: JSON.stringify(emailData),
  });
}