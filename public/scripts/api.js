/**
 * API functionality for the Broker Admin Dashboard
 * 
 * This file simulates a backend API using in-memory storage.
 */

// In-memory storage for users, transactions, and email notifications
const usersStore = new Map();
const transactionsStore = new Map();
const emailsStore = new Map();

// Counters for generating IDs
let userIdCounter = 1;
let transactionIdCounter = 1;
let emailIdCounter = 1;

// Seed the store with initial data
(function seedInitialData() {
    // Create admin user
    createUser({
        username: 'admin',
        password: 'admin123', // In a real app, this would be hashed
        fullName: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        status: 'active',
        balance: 0,
    });
    
    // Create some demo users
    createUser({
        username: 'jsmith',
        password: 'password123',
        fullName: 'John Smith',
        email: 'john.smith@example.com',
        role: 'client',
        status: 'active',
        balance: 25000.75,
    });
    
    createUser({
        username: 'agarcia',
        password: 'password123',
        fullName: 'Ana Garcia',
        email: 'ana.garcia@example.com',
        role: 'client',
        status: 'active',
        balance: 7520.50,
    });
    
    createUser({
        username: 'mjohnson',
        password: 'password123',
        fullName: 'Michael Johnson',
        email: 'michael.johnson@example.com',
        role: 'client',
        status: 'inactive',
        balance: 0,
    });
    
    createUser({
        username: 'lwilliams',
        password: 'password123',
        fullName: 'Lisa Williams',
        email: 'lisa.williams@example.com',
        role: 'client',
        status: 'active',
        balance: 12350.25,
    });
    
    // Create some demo transactions
    createTransaction({
        userId: 2, // John Smith
        amount: 10000,
        type: 'deposit',
        status: 'completed',
        notes: 'Initial deposit',
    });
    
    createTransaction({
        userId: 2, // John Smith
        amount: 15000.75,
        type: 'deposit',
        status: 'completed',
        notes: 'Additional investment',
    });
    
    createTransaction({
        userId: 3, // Ana Garcia
        amount: 7520.50,
        type: 'deposit',
        status: 'completed',
        notes: 'Initial deposit',
    });
    
    createTransaction({
        userId: 4, // Lisa Williams
        amount: 15000,
        type: 'deposit',
        status: 'completed',
        notes: 'Initial deposit',
    });
    
    createTransaction({
        userId: 4, // Lisa Williams
        amount: -2649.75,
        type: 'withdrawal',
        status: 'completed',
        notes: 'Partial withdrawal request',
    });
    
    // Create some demo email notifications
    createEmailNotification({
        recipientEmails: ['john.smith@example.com'],
        subject: 'Welcome to our platform!',
        content: 'Thank you for registering with our brokerage service. We are excited to have you on board.',
        status: 'sent',
    });
    
    createEmailNotification({
        recipientEmails: ['ana.garcia@example.com'],
        subject: 'Your account is now active',
        content: 'Congratulations! Your brokerage account is now fully activated and ready for trading.',
        status: 'sent',
    });
    
    createEmailNotification({
        recipientEmails: ['john.smith@example.com', 'ana.garcia@example.com', 'lisa.williams@example.com'],
        subject: 'New investment opportunities available',
        content: 'Check out our newest investment options that have just become available on the platform.',
        status: 'sent',
    });
})();

/**
 * Get all users
 * @returns {Array} Array of user objects
 */
function getUsers() {
    return Array.from(usersStore.values());
}

/**
 * Get user by ID
 * @param {number} userId - ID of the user to retrieve
 * @returns {Object|null} User object or null if not found
 */
function getUserById(userId) {
    return usersStore.get(userId) || null;
}

/**
 * Get user by username
 * @param {string} username - Username to search for
 * @returns {Object|null} User object or null if not found
 */
function getUserByUsername(username) {
    for (const user of usersStore.values()) {
        if (user.username === username) {
            return user;
        }
    }
    return null;
}

/**
 * Create a new user
 * @param {Object} userData - User data object
 * @returns {Object} The created user
 */
function createUser(userData) {
    const timestamp = new Date().toISOString();
    const newUser = {
        id: userIdCounter++,
        username: userData.username,
        password: userData.password,
        fullName: userData.fullName,
        email: userData.email,
        role: userData.role || 'client',
        status: userData.status || 'active',
        balance: parseFloat(userData.balance) || 0,
        createdAt: timestamp,
        updatedAt: timestamp
    };
    
    usersStore.set(newUser.id, newUser);
    return newUser;
}

/**
 * Update a user
 * @param {number} userId - ID of the user to update
 * @param {Object} updatedData - New user data
 * @returns {Object|null} Updated user or null if not found
 */
function updateUser(userId, updatedData) {
    const user = usersStore.get(userId);
    
    if (!user) return null;
    
    const updatedUser = {
        ...user,
        ...updatedData,
        updatedAt: new Date().toISOString()
    };
    
    usersStore.set(userId, updatedUser);
    return updatedUser;
}

/**
 * Update user balance
 * @param {number} userId - ID of the user to update
 * @param {number} newBalance - New balance value
 * @returns {Object|null} Updated user or null if not found
 */
function updateUserBalance(userId, newBalance) {
    const user = usersStore.get(userId);
    
    if (!user) return null;
    
    const updatedUser = {
        ...user,
        balance: newBalance,
        updatedAt: new Date().toISOString()
    };
    
    usersStore.set(userId, updatedUser);
    return updatedUser;
}

/**
 * Get all transactions
 * @returns {Array} Array of transaction objects
 */
function getTransactions() {
    return Array.from(transactionsStore.values());
}

/**
 * Get transactions for a specific user
 * @param {number} userId - ID of the user
 * @returns {Array} Array of transaction objects
 */
function getUserTransactions(userId) {
    return Array.from(transactionsStore.values())
        .filter(transaction => transaction.userId === userId);
}

/**
 * Create a new transaction
 * @param {Object} transactionData - Transaction data
 * @returns {Object} The created transaction
 */
function createTransaction(transactionData) {
    const timestamp = new Date().toISOString();
    const newTransaction = {
        id: transactionIdCounter++,
        userId: transactionData.userId,
        amount: parseFloat(transactionData.amount),
        type: transactionData.type,
        status: transactionData.status || 'pending',
        notes: transactionData.notes || '',
        createdAt: timestamp,
        updatedAt: timestamp
    };
    
    transactionsStore.set(newTransaction.id, newTransaction);
    
    // Update user balance
    const user = usersStore.get(newTransaction.userId);
    if (user) {
        const newBalance = user.balance + newTransaction.amount;
        updateUserBalance(user.id, newBalance);
    }
    
    return newTransaction;
}

/**
 * Get all email notifications
 * @returns {Array} Array of email notification objects
 */
function getEmailNotifications() {
    return Array.from(emailsStore.values());
}

/**
 * Create a new email notification
 * @param {Object} emailData - Email notification data
 * @returns {Object} The created email notification
 */
function createEmailNotification(emailData) {
    const timestamp = new Date().toISOString();
    const newEmailNotification = {
        id: emailIdCounter++,
        recipientEmails: emailData.recipientEmails,
        subject: emailData.subject,
        content: emailData.content,
        status: emailData.status || 'pending',
        createdAt: timestamp,
        updatedAt: timestamp
    };
    
    emailsStore.set(newEmailNotification.id, newEmailNotification);
    return newEmailNotification;
}