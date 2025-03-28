/**
 * API Functions for the Broker Admin Dashboard
 * 
 * This file contains functions for making API calls to the backend.
 * For the static HTML/JS version, these functions work with local storage.
 */

// Local Storage Keys
const USERS_STORAGE_KEY = 'broker_admin_users';
const TRANSACTIONS_STORAGE_KEY = 'broker_admin_transactions';
const EMAIL_NOTIFICATIONS_STORAGE_KEY = 'broker_admin_emails';

// Initialize local storage with default data if empty
(function initStorage() {
    // Check if data already exists
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    const transactions = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
    const emails = localStorage.getItem(EMAIL_NOTIFICATIONS_STORAGE_KEY);
    
    // Seed initial data if not exists
    if (!users) {
        const defaultUsers = [
            {
                id: 1,
                username: 'admin',
                password: 'admin123',
                fullName: 'Admin User',
                email: 'admin@example.com',
                role: 'admin',
                balance: 0,
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                username: 'johndoe',
                password: 'password123',
                fullName: 'John Doe',
                email: 'john.doe@example.com',
                role: 'client',
                balance: 5000,
                status: 'active',
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
            },
            {
                id: 3,
                username: 'janesmith',
                password: 'password123',
                fullName: 'Jane Smith',
                email: 'jane.smith@example.com',
                role: 'client',
                balance: 7500,
                status: 'active',
                createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
            },
            {
                id: 4,
                username: 'mikebrown',
                password: 'password123',
                fullName: 'Mike Brown',
                email: 'mike.brown@example.com',
                role: 'broker',
                balance: 10000,
                status: 'active',
                createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
            },
            {
                id: 5,
                username: 'sarahjones',
                password: 'password123',
                fullName: 'Sarah Jones',
                email: 'sarah.jones@example.com',
                role: 'client',
                balance: 2500,
                status: 'inactive',
                createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() // 10 days ago
            }
        ];
        
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers));
    }
    
    if (!transactions) {
        const defaultTransactions = [
            {
                id: 1,
                userId: 2,
                amount: 5000,
                type: 'deposit',
                status: 'completed',
                notes: 'Initial deposit',
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
            },
            {
                id: 2,
                userId: 3,
                amount: 7500,
                type: 'deposit',
                status: 'completed',
                notes: 'Initial deposit',
                createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
            },
            {
                id: 3,
                userId: 4,
                amount: 10000,
                type: 'deposit',
                status: 'completed',
                notes: 'Initial deposit',
                createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
            },
            {
                id: 4,
                userId: 2,
                amount: -1000,
                type: 'withdrawal',
                status: 'completed',
                notes: 'Withdrawal request',
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
            },
            {
                id: 5,
                userId: 3,
                amount: 1000,
                type: 'deposit',
                status: 'completed',
                notes: 'Additional deposit',
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
            }
        ];
        
        localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(defaultTransactions));
    }
    
    if (!emails) {
        const defaultEmails = [
            {
                id: 1,
                recipientEmails: ['john.doe@example.com'],
                subject: 'Welcome to our platform',
                content: 'Dear John Doe,\n\nWelcome to our brokerage platform. We are excited to have you on board.\n\nBest regards,\nThe Admin Team',
                status: 'sent',
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
            },
            {
                id: 2,
                recipientEmails: ['jane.smith@example.com'],
                subject: 'Welcome to our platform',
                content: 'Dear Jane Smith,\n\nWelcome to our brokerage platform. We are excited to have you on board.\n\nBest regards,\nThe Admin Team',
                status: 'sent',
                createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
            },
            {
                id: 3,
                recipientEmails: ['mike.brown@example.com'],
                subject: 'Welcome to our platform',
                content: 'Dear Mike Brown,\n\nWelcome to our brokerage platform. We are excited to have you on board.\n\nBest regards,\nThe Admin Team',
                status: 'sent',
                createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
            },
            {
                id: 4,
                recipientEmails: ['john.doe@example.com'],
                subject: 'Transaction Confirmation: Withdrawal',
                content: 'Dear John Doe,\n\nA withdrawal for $1,000.00 has been completed in your account.\n\nBest regards,\nThe Admin Team',
                status: 'sent',
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
            },
            {
                id: 5,
                recipientEmails: ['jane.smith@example.com'],
                subject: 'Transaction Confirmation: Deposit',
                content: 'Dear Jane Smith,\n\nA deposit for $1,000.00 has been completed in your account.\n\nBest regards,\nThe Admin Team',
                status: 'sent',
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
            }
        ];
        
        localStorage.setItem(EMAIL_NOTIFICATIONS_STORAGE_KEY, JSON.stringify(defaultEmails));
    }
})();

/**
 * Get all users
 * @returns {Array} Array of user objects
 */
function getUsers() {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
}

/**
 * Get user by ID
 * @param {number} userId - ID of the user to retrieve
 * @returns {Object|null} User object or null if not found
 */
function getUserById(userId) {
    const users = getUsers();
    return users.find(user => user.id === userId) || null;
}

/**
 * Get user by username
 * @param {string} username - Username to search for
 * @returns {Object|null} User object or null if not found
 */
function getUserByUsername(username) {
    const users = getUsers();
    return users.find(user => user.username === username) || null;
}

/**
 * Create a new user
 * @param {Object} userData - User data object
 * @returns {Object} The created user
 */
function createUser(userData) {
    const users = getUsers();
    
    // Generate new ID
    const newId = users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1;
    
    // Create user object
    const newUser = {
        id: newId,
        username: userData.username,
        password: userData.password,
        fullName: userData.fullName,
        email: userData.email,
        role: userData.role || 'client',
        balance: parseFloat(userData.initialBalance || 0),
        status: 'active',
        createdAt: new Date().toISOString()
    };
    
    // Add to users array
    users.push(newUser);
    
    // Save to local storage
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    
    return newUser;
}

/**
 * Update a user
 * @param {number} userId - ID of the user to update
 * @param {Object} updatedData - New user data
 * @returns {Object|null} Updated user or null if not found
 */
function updateUser(userId, updatedData) {
    const users = getUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
        return null;
    }
    
    // Update user data
    const updatedUser = { ...users[userIndex], ...updatedData };
    users[userIndex] = updatedUser;
    
    // Save to local storage
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    
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
    const transactions = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
    return transactions ? JSON.parse(transactions) : [];
}

/**
 * Get transactions for a specific user
 * @param {number} userId - ID of the user
 * @returns {Array} Array of transaction objects
 */
function getUserTransactions(userId) {
    const transactions = getTransactions();
    return transactions.filter(transaction => transaction.userId === userId);
}

/**
 * Create a new transaction
 * @param {Object} transactionData - Transaction data
 * @returns {Object} The created transaction
 */
function createTransaction(transactionData) {
    const transactions = getTransactions();
    
    // Generate new ID
    const newId = transactions.length > 0 ? Math.max(...transactions.map(transaction => transaction.id)) + 1 : 1;
    
    // Create transaction object
    const newTransaction = {
        id: newId,
        userId: transactionData.userId,
        amount: parseFloat(transactionData.amount),
        type: transactionData.type,
        status: transactionData.status || 'completed',
        notes: transactionData.notes || '',
        createdAt: new Date().toISOString()
    };
    
    // Add to transactions array
    transactions.push(newTransaction);
    
    // Save to local storage
    localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions));
    
    // Update user balance if transaction is completed
    if (newTransaction.status === 'completed') {
        const user = getUserById(newTransaction.userId);
        if (user) {
            const newBalance = user.balance + newTransaction.amount;
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
    const emails = localStorage.getItem(EMAIL_NOTIFICATIONS_STORAGE_KEY);
    return emails ? JSON.parse(emails) : [];
}

/**
 * Create a new email notification
 * @param {Object} emailData - Email notification data
 * @returns {Object} The created email notification
 */
function createEmailNotification(emailData) {
    const emails = getEmailNotifications();
    
    // Generate new ID
    const newId = emails.length > 0 ? Math.max(...emails.map(email => email.id)) + 1 : 1;
    
    // Create email notification object
    const newEmail = {
        id: newId,
        recipientEmails: emailData.recipientEmails,
        subject: emailData.subject,
        content: emailData.content,
        status: emailData.status || 'sent',
        createdAt: new Date().toISOString()
    };
    
    // Add to emails array
    emails.push(newEmail);
    
    // Save to local storage
    localStorage.setItem(EMAIL_NOTIFICATIONS_STORAGE_KEY, JSON.stringify(emails));
    
    return newEmail;
}