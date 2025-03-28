/**
 * API Utilities for the Broker Admin Dashboard
 * 
 * This file contains functions for interacting with the in-memory data store.
 * In a real application, these would communicate with a backend server.
 */

// Create an in-memory data store for a frontend-only application
const dataStore = {
    users: [
        { id: 1, username: 'john_smith', password: 'password', email: 'john.smith@example.com', fullName: 'John Smith', balance: 12456.00, status: 'active', createdAt: new Date(2023, 5, 15) },
        { id: 2, username: 'emma_watson', password: 'password', email: 'emma.watson@example.com', fullName: 'Emma Watson', balance: 1850.00, status: 'active', createdAt: new Date(2023, 5, 16) },
        { id: 3, username: 'robert_johnson', password: 'password', email: 'robert.j@example.com', fullName: 'Robert Johnson', balance: 3720.50, status: 'pending', createdAt: new Date(2023, 5, 17) },
        { id: 4, username: 'mary_parker', password: 'password', email: 'mary.p@example.com', fullName: 'Mary Parker', balance: 8125.75, status: 'inactive', createdAt: new Date(2023, 5, 19) },
        { id: 5, username: 'tom_wilson', password: 'password', email: 'tom.wilson@example.com', fullName: 'Tom Wilson', balance: 5750.25, status: 'active', createdAt: new Date(2023, 5, 20) }
    ],
    transactions: [
        { id: 1, userId: 1, amount: 2500.00, type: 'deposit', status: 'completed', notes: 'Initial deposit', createdAt: new Date(2023, 5, 19, 14, 32, 45) },
        { id: 2, userId: 2, amount: -750.00, type: 'withdrawal', status: 'completed', notes: '', createdAt: new Date(2023, 5, 19, 12, 15, 22) },
        { id: 3, userId: 3, amount: 1200.00, type: 'deposit', status: 'pending', notes: '', createdAt: new Date(2023, 5, 18, 18, 45, 10) },
        { id: 4, userId: 4, amount: 3500.00, type: 'deposit', status: 'completed', notes: 'Bonus payment', createdAt: new Date(2023, 5, 18, 10, 12, 33) },
        { id: 5, userId: 5, amount: -1800.00, type: 'withdrawal', status: 'failed', notes: 'Insufficient funds', createdAt: new Date(2023, 5, 17, 16, 50, 27) }
    ],
    emailNotifications: [
        { id: 1, subject: 'Welcome to our broker platform', content: 'Welcome email content...', recipientType: 'all', recipientIds: null, sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), openRate: 87 },
        { id: 2, subject: 'Important Security Update', content: 'Security update content...', recipientType: 'all', recipientIds: null, sentAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), openRate: 92 },
        { id: 3, subject: 'Funds Added Notification', content: 'Your funds have been added...', recipientType: 'custom', recipientIds: '4', sentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), openRate: 100 },
        { id: 4, subject: 'New Feature Announcement', content: 'We\'ve added new features...', recipientType: 'active', recipientIds: null, sentAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), openRate: 78 }
    ]
};

// Initialize counter for new data entries
let idCounters = {
    users: 6,
    transactions: 6,
    emailNotifications: 5
};

/**
 * Get all users
 * @returns {Array} Array of user objects
 */
function getUsers() {
    return [...dataStore.users];
}

/**
 * Get user by ID
 * @param {number} userId - ID of the user to retrieve
 * @returns {Object|null} User object or null if not found
 */
function getUserById(userId) {
    return dataStore.users.find(user => user.id === userId) || null;
}

/**
 * Get user by username
 * @param {string} username - Username to search for
 * @returns {Object|null} User object or null if not found
 */
function getUserByUsername(username) {
    return dataStore.users.find(user => user.username.toLowerCase() === username.toLowerCase()) || null;
}

/**
 * Create a new user
 * @param {Object} userData - User data object
 * @returns {Object} The created user
 */
function createUser(userData) {
    const newUser = {
        id: idCounters.users++,
        username: userData.username,
        password: userData.password,
        email: userData.email,
        fullName: userData.fullName,
        balance: userData.balance || 0,
        status: userData.status || 'active',
        createdAt: new Date()
    };
    
    dataStore.users.push(newUser);
    return newUser;
}

/**
 * Update a user
 * @param {number} userId - ID of the user to update
 * @param {Object} updatedData - New user data
 * @returns {Object|null} Updated user or null if not found
 */
function updateUser(userId, updatedData) {
    const userIndex = dataStore.users.findIndex(user => user.id === userId);
    if (userIndex === -1) return null;
    
    const updatedUser = { ...dataStore.users[userIndex], ...updatedData };
    dataStore.users[userIndex] = updatedUser;
    return updatedUser;
}

/**
 * Update user balance
 * @param {number} userId - ID of the user to update
 * @param {number} newBalance - New balance value
 * @returns {Object|null} Updated user or null if not found
 */
function updateUserBalance(userId, newBalance) {
    return updateUser(userId, { balance: newBalance });
}

/**
 * Get all transactions
 * @returns {Array} Array of transaction objects
 */
function getTransactions() {
    return [...dataStore.transactions];
}

/**
 * Get transactions for a specific user
 * @param {number} userId - ID of the user
 * @returns {Array} Array of transaction objects
 */
function getUserTransactions(userId) {
    return dataStore.transactions.filter(transaction => transaction.userId === userId);
}

/**
 * Create a new transaction
 * @param {Object} transactionData - Transaction data
 * @returns {Object} The created transaction
 */
function createTransaction(transactionData) {
    const newTransaction = {
        id: idCounters.transactions++,
        userId: transactionData.userId,
        amount: transactionData.amount,
        type: transactionData.type,
        status: transactionData.status || 'completed',
        notes: transactionData.notes || '',
        createdAt: new Date()
    };
    
    dataStore.transactions.push(newTransaction);
    
    // If this is a deposit or withdrawal, update the user's balance
    if (transactionData.type === 'deposit' || transactionData.type === 'withdrawal') {
        const user = getUserById(transactionData.userId);
        if (user) {
            const newBalance = user.balance + parseFloat(transactionData.amount);
            updateUserBalance(user.id, newBalance);
        }
    }
    
    return newTransaction;
}

/**
 * Get all email notifications
 * @returns {Array} Array of email notification objects
 */
function getEmailNotifications() {
    return [...dataStore.emailNotifications];
}

/**
 * Create a new email notification
 * @param {Object} emailData - Email notification data
 * @returns {Object} The created email notification
 */
function createEmailNotification(emailData) {
    const newEmail = {
        id: idCounters.emailNotifications++,
        subject: emailData.subject,
        content: emailData.content,
        recipientType: emailData.recipientType,
        recipientIds: emailData.recipientIds || null,
        sentAt: new Date(),
        openRate: 0
    };
    
    dataStore.emailNotifications.push(newEmail);
    return newEmail;
}