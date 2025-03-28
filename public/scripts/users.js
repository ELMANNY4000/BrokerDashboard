/**
 * Users JavaScript for the Broker Admin Dashboard
 * 
 * This file contains functions specific to the users page.
 */

/**
 * Load users data and populate the table
 */
async function loadUsersData() {
    try {
        const users = getUsers();
        
        // Load users table
        loadUsersTable(users);
    } catch (error) {
        console.error('Error loading users data:', error);
        showToast('error', 'Data Loading Error', 'Failed to load users data. Please try refreshing the page.');
    }
}

/**
 * Load users table with user data
 * @param {Array} users - List of users to display
 */
function loadUsersTable(users) {
    const tableBody = document.getElementById('users-table');
    if (!tableBody) return;
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Sort users by creation date (newest first)
    const sortedUsers = [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Add rows to table
    sortedUsers.forEach(user => {
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
        
        // Created date cell
        const createdCell = document.createElement('td');
        createdCell.textContent = formatDate(user.createdAt);
        
        // Actions cell
        const actionsCell = document.createElement('td');
        actionsCell.innerHTML = `
            <div class="action-buttons">
                <button class="icon-btn add-funds-btn" title="Add Funds" data-user-id="${user.id}">
                    <i class="fas fa-wallet"></i>
                </button>
                <button class="icon-btn send-email-btn" title="Send Email" data-user-id="${user.id}">
                    <i class="fas fa-envelope"></i>
                </button>
                <button class="icon-btn view-transactions-btn" title="View Transactions" data-user-id="${user.id}">
                    <i class="fas fa-exchange-alt"></i>
                </button>
            </div>
        `;
        
        // Add cells to row
        row.appendChild(userCell);
        row.appendChild(statusCell);
        row.appendChild(balanceCell);
        row.appendChild(createdCell);
        row.appendChild(actionsCell);
        
        // Add row to table
        tableBody.appendChild(row);
    });
    
    // Add event listeners to buttons
    setupActionButtons();
}

/**
 * Set up action buttons event listeners
 */
function setupActionButtons() {
    // Add funds button click
    const addFundsButtons = document.querySelectorAll('.add-funds-btn');
    addFundsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userId = parseInt(this.getAttribute('data-user-id'));
            const user = getUserById(userId);
            if (user) {
                openAddFundsModal(user);
            }
        });
    });
    
    // Send email button click
    const sendEmailButtons = document.querySelectorAll('.send-email-btn');
    sendEmailButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userId = parseInt(this.getAttribute('data-user-id'));
            const user = getUserById(userId);
            if (user) {
                window.location.href = `email-notifications.html?userId=${userId}`;
            }
        });
    });
    
    // View transactions button click
    const viewTransactionsButtons = document.querySelectorAll('.view-transactions-btn');
    viewTransactionsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            window.location.href = `transactions.html?userId=${userId}`;
        });
    });
}

/**
 * Set up new user form
 */
function setupNewUserForm() {
    const newUserBtn = document.getElementById('new-user-btn');
    const newUserModal = document.getElementById('new-user-modal');
    const newUserForm = document.getElementById('new-user-form');
    
    if (newUserBtn) {
        newUserBtn.addEventListener('click', function() {
            if (newUserModal) {
                newUserModal.classList.add('active');
            }
        });
    }
    
    if (newUserForm) {
        newUserForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const userData = {
                username: document.getElementById('new-username').value,
                password: document.getElementById('new-password').value,
                fullName: document.getElementById('new-fullname').value,
                email: document.getElementById('new-email').value,
                role: document.getElementById('new-role').value,
                status: document.getElementById('new-status').value,
                balance: parseFloat(document.getElementById('new-balance').value) || 0
            };
            
            // Validate username uniqueness
            const existingUser = getUserByUsername(userData.username);
            if (existingUser) {
                showToast('error', 'Invalid Username', 'Username already exists. Please choose a different one.');
                return;
            }
            
            // Create user
            const user = createUser(userData);
            
            if (user) {
                // Close the modal
                newUserModal.classList.remove('active');
                
                // Show success message
                showToast('success', 'User Created', `User ${user.fullName} has been created successfully.`);
                
                // Create initial transaction if there's a balance
                if (user.balance > 0) {
                    createTransaction({
                        userId: user.id,
                        amount: user.balance,
                        type: 'deposit',
                        status: 'completed',
                        notes: 'Initial balance'
                    });
                }
                
                // Reload users data
                loadUsersData();
                
                // Reset form
                newUserForm.reset();
            }
        });
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadUsersData();
    setupNewUserForm();
});