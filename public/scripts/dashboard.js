/**
 * Dashboard JavaScript for the Broker Admin Dashboard
 * 
 * This file contains functions specific to the dashboard page.
 */

/**
 * Load all dashboard data
 */
function loadDashboardData() {
    try {
        const users = getUsers();
        const transactions = getTransactions();
        const emailNotifications = getEmailNotifications();
        
        // Update stats cards
        updateStatsCards(users, transactions, emailNotifications);
        
        // Load recent users table
        loadRecentUsers(users);
        
        // Load recent transactions table
        loadRecentTransactions(users, transactions);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showToast('error', 'Data Loading Error', 'Failed to load dashboard data. Please try refreshing the page.');
    }
}

/**
 * Update stats cards with current data
 * @param {Array} users - List of users
 * @param {Array} transactions - List of transactions
 * @param {Array} emailNotifications - List of email notifications
 */
function updateStatsCards(users, transactions, emailNotifications) {
    // Update total users count
    const totalUsersElement = document.getElementById('total-users-count');
    if (totalUsersElement) {
        totalUsersElement.textContent = users.length;
    }
    
    // Update total balance
    const totalBalanceElement = document.getElementById('total-balance');
    if (totalBalanceElement) {
        const totalBalance = users.reduce((sum, user) => sum + parseFloat(user.balance), 0);
        totalBalanceElement.textContent = formatCurrency(totalBalance);
    }
    
    // Update total transactions
    const totalTransactionsElement = document.getElementById('total-transactions');
    if (totalTransactionsElement) {
        totalTransactionsElement.textContent = transactions.length;
    }
    
    // Update total email campaigns
    const totalEmailsElement = document.getElementById('total-emails');
    if (totalEmailsElement) {
        totalEmailsElement.textContent = emailNotifications.length;
    }
}

/**
 * Load recent users table
 * @param {Array} users - List of users
 */
function loadRecentUsers(users) {
    const tableBody = document.getElementById('recent-users-table');
    if (!tableBody) return;
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Sort users by creation date (newest first) and take first 5
    const recentUsers = [...users]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
    
    // Add rows to table
    recentUsers.forEach(user => {
        const row = document.createElement('tr');
        
        // User cell with avatar
        const userCell = document.createElement('td');
        userCell.innerHTML = `
            <div class="user-cell">
                <div class="user-cell-avatar">${getInitials(user.fullName)}</div>
                <div class="user-cell-info">
                    <p>${user.fullName}</p>
                    <span>${user.email}</span>
                </div>
            </div>
        `;
        
        // Status cell
        const statusCell = document.createElement('td');
        statusCell.innerHTML = `
            <span class="status-badge status-${user.status}">${user.status}</span>
        `;
        
        // Balance cell
        const balanceCell = document.createElement('td');
        balanceCell.textContent = formatCurrency(user.balance);
        
        // Actions cell
        const actionsCell = document.createElement('td');
        actionsCell.innerHTML = `
            <div class="action-buttons">
                <button class="icon-btn add-funds-btn" title="Add Funds" data-user-id="${user.id}">
                    <i class="fas fa-wallet"></i>
                </button>
                <button class="icon-btn view-user-btn" title="View Details" data-user-id="${user.id}">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        `;
        
        // Add cells to row
        row.appendChild(userCell);
        row.appendChild(statusCell);
        row.appendChild(balanceCell);
        row.appendChild(actionsCell);
        
        // Add row to table
        tableBody.appendChild(row);
    });
    
    // Add event listeners to buttons
    const addFundsButtons = tableBody.querySelectorAll('.add-funds-btn');
    addFundsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userId = parseInt(this.getAttribute('data-user-id'));
            const user = getUserById(userId);
            if (user) {
                openAddFundsModal(user);
            }
        });
    });
    
    const viewUserButtons = tableBody.querySelectorAll('.view-user-btn');
    viewUserButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            window.location.href = `users.html?id=${userId}`;
        });
    });
}

/**
 * Load recent transactions table
 * @param {Array} users - List of users
 * @param {Array} transactions - List of transactions
 */
function loadRecentTransactions(users, transactions) {
    const tableBody = document.getElementById('recent-transactions-table');
    if (!tableBody) return;
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Sort transactions by creation date (newest first) and take first 5
    const recentTransactions = [...transactions]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
    
    // Add rows to table
    recentTransactions.forEach(transaction => {
        // Get user for this transaction
        const user = users.find(u => u.id === transaction.userId) || { fullName: 'Unknown User', email: 'unknown' };
        
        const row = document.createElement('tr');
        
        // User cell with avatar
        const userCell = document.createElement('td');
        userCell.innerHTML = `
            <div class="user-cell">
                <div class="user-cell-avatar">${getInitials(user.fullName)}</div>
                <div class="user-cell-info">
                    <p>${user.fullName}</p>
                    <span>${user.email}</span>
                </div>
            </div>
        `;
        
        // Type cell
        const typeCell = document.createElement('td');
        let typeIcon, typeClass;
        
        switch (transaction.type) {
            case 'deposit':
                typeIcon = 'fa-arrow-down';
                typeClass = 'transaction-deposit';
                break;
            case 'withdrawal':
                typeIcon = 'fa-arrow-up';
                typeClass = 'transaction-withdrawal';
                break;
            case 'transfer':
                typeIcon = 'fa-exchange-alt';
                typeClass = 'transaction-transfer';
                break;
            default:
                typeIcon = 'fa-sync-alt';
                typeClass = 'transaction-adjustment';
        }
        
        typeCell.innerHTML = `
            <span class="transaction-type ${typeClass}">
                <i class="fas ${typeIcon}"></i> ${transaction.type}
            </span>
        `;
        
        // Amount cell
        const amountCell = document.createElement('td');
        const amount = parseFloat(transaction.amount);
        const formattedAmount = formatCurrency(Math.abs(amount));
        amountCell.innerHTML = `
            <span class="${amount >= 0 ? 'transaction-deposit' : 'transaction-withdrawal'}">
                ${amount >= 0 ? '+' : '-'} ${formattedAmount}
            </span>
        `;
        
        // Date cell
        const dateCell = document.createElement('td');
        dateCell.textContent = formatDate(transaction.createdAt);
        
        // Add cells to row
        row.appendChild(userCell);
        row.appendChild(typeCell);
        row.appendChild(amountCell);
        row.appendChild(dateCell);
        
        // Add row to table
        tableBody.appendChild(row);
    });
}

// Load dashboard data when the page loads
document.addEventListener('DOMContentLoaded', loadDashboardData);