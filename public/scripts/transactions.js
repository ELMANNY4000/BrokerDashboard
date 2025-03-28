/**
 * Transactions JavaScript for the Broker Admin Dashboard
 * 
 * This file contains functions specific to the transactions page.
 */

// Globals
let filteredUserId = null;

/**
 * Load transactions data and populate the table
 */
async function loadTransactionsData() {
    try {
        // Check if we're filtering by user ID
        const urlParams = new URLSearchParams(window.location.search);
        filteredUserId = urlParams.get('userId') ? parseInt(urlParams.get('userId')) : null;
        
        // Get all transactions
        let transactions = getTransactions();
        
        // Get all users for reference
        const users = getUsers();
        
        // Filter transactions if needed
        if (filteredUserId) {
            transactions = transactions.filter(transaction => transaction.userId === filteredUserId);
            showUserFilterCard(filteredUserId);
        }
        
        // Load transactions table
        loadTransactionsTable(transactions, users);
        
        // Setup new transaction form
        setupTransactionForm(users);
    } catch (error) {
        console.error('Error loading transactions data:', error);
        showToast('error', 'Data Loading Error', 'Failed to load transactions data. Please try refreshing the page.');
    }
}

/**
 * Load transactions table with transaction data
 * @param {Array} transactions - List of transactions to display
 * @param {Array} users - List of users for reference
 */
function loadTransactionsTable(transactions, users) {
    const tableBody = document.getElementById('transactions-table');
    if (!tableBody) return;
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Sort transactions by creation date (newest first)
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Add rows to table
    sortedTransactions.forEach(transaction => {
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
        
        // Status cell
        const statusCell = document.createElement('td');
        let statusClass;
        
        switch (transaction.status) {
            case 'completed':
                statusClass = 'status-active';
                break;
            case 'failed':
                statusClass = 'status-inactive';
                break;
            default:
                statusClass = 'status-pending';
        }
        
        statusCell.innerHTML = `
            <span class="status-badge ${statusClass}">${transaction.status}</span>
        `;
        
        // Date cell
        const dateCell = document.createElement('td');
        dateCell.textContent = formatDate(transaction.createdAt);
        
        // Notes cell
        const notesCell = document.createElement('td');
        notesCell.textContent = transaction.notes || '-';
        
        // Add cells to row
        row.appendChild(userCell);
        row.appendChild(typeCell);
        row.appendChild(amountCell);
        row.appendChild(statusCell);
        row.appendChild(dateCell);
        row.appendChild(notesCell);
        
        // Add row to table
        tableBody.appendChild(row);
    });
}

/**
 * Show user filter card when filtering by user
 * @param {number} userId - ID of the user to filter by
 */
function showUserFilterCard(userId) {
    const filterCard = document.getElementById('user-filter-card');
    const user = getUserById(userId);
    
    if (filterCard && user) {
        // Show filter card
        filterCard.style.display = 'block';
        
        // Set user info
        document.getElementById('user-filter-avatar').textContent = getInitials(user.fullName);
        document.getElementById('user-filter-name').textContent = user.fullName;
        document.getElementById('user-filter-email').textContent = user.email;
    }
}

/**
 * Set up new transaction form
 * @param {Array} users - List of users
 */
function setupTransactionForm(users) {
    const newTransactionBtn = document.getElementById('new-transaction-btn');
    const transactionModal = document.getElementById('transaction-modal');
    const transactionForm = document.getElementById('transaction-form');
    const userSelect = document.getElementById('transaction-user');
    
    // Populate user select dropdown
    if (userSelect) {
        // Sort users alphabetically by name
        const sortedUsers = [...users]
            .filter(user => user.status === 'active')
            .sort((a, b) => a.fullName.localeCompare(b.fullName));
        
        // Add options
        sortedUsers.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = `${user.fullName} (${user.email})`;
            userSelect.appendChild(option);
        });
        
        // If filtering by user, preselect that user
        if (filteredUserId) {
            userSelect.value = filteredUserId;
        }
    }
    
    // New transaction button click
    if (newTransactionBtn) {
        newTransactionBtn.addEventListener('click', function() {
            if (transactionModal) {
                transactionModal.classList.add('active');
            }
        });
    }
    
    // Transaction form submit
    if (transactionForm) {
        transactionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const userId = parseInt(document.getElementById('transaction-user').value);
            const type = document.getElementById('transaction-type').value;
            let amount = parseFloat(document.getElementById('transaction-amount').value);
            const status = document.getElementById('transaction-status').value;
            const notes = document.getElementById('transaction-notes').value;
            const sendEmail = document.getElementById('send-email-checkbox').checked;
            
            // Adjust amount for withdrawals if needed
            if (type === 'withdrawal' && amount > 0) {
                amount = -amount;
            }
            
            // Validate data
            if (!userId || isNaN(userId) || isNaN(amount)) {
                showToast('error', 'Invalid Input', 'Please fill in all required fields with valid values.');
                return;
            }
            
            // Get user
            const user = getUserById(userId);
            if (!user) {
                showToast('error', 'User Not Found', 'Selected user could not be found.');
                return;
            }
            
            // Check if withdrawal amount exceeds balance
            if (type === 'withdrawal' && Math.abs(amount) > user.balance) {
                showToast('error', 'Insufficient Balance', 'Withdrawal amount exceeds user balance.');
                return;
            }
            
            // Create transaction
            const transaction = createTransaction({
                userId: userId,
                amount: amount,
                type: type,
                status: status,
                notes: notes
            });
            
            if (transaction) {
                // Close the modal
                transactionModal.classList.remove('active');
                
                // Show success message
                showToast('success', 'Transaction Created', `Transaction for ${formatCurrency(Math.abs(amount))} has been created.`);
                
                // Send email notification if checked
                if (sendEmail && user) {
                    createEmailNotification({
                        recipientEmails: [user.email],
                        subject: `Transaction Notification: ${type}`,
                        content: `Dear ${user.fullName},\n\nA ${type} transaction for ${formatCurrency(Math.abs(amount))} has been ${status} in your account.\n\nNotes: ${notes || 'None'}\n\nThank you for using our service.`,
                        status: 'sent'
                    });
                }
                
                // Reload transactions data
                loadTransactionsData();
                
                // Reset form
                transactionForm.reset();
                
                // If filtering by user, preselect that user
                if (filteredUserId) {
                    document.getElementById('transaction-user').value = filteredUserId;
                }
            }
        });
    }
    
    // Auto-adjust amount sign based on transaction type
    const typeSelect = document.getElementById('transaction-type');
    const amountInput = document.getElementById('transaction-amount');
    
    if (typeSelect && amountInput) {
        typeSelect.addEventListener('change', function() {
            const type = this.value;
            const currentAmount = parseFloat(amountInput.value) || 0;
            
            if (type === 'withdrawal') {
                // If switching to withdrawal and amount is positive, make it negative
                if (currentAmount > 0) {
                    amountInput.value = -Math.abs(currentAmount);
                }
                // Update helper text
                amountInput.nextElementSibling.textContent = 'Amount will be deducted from user balance.';
            } else {
                // If switching from withdrawal and amount is negative, make it positive
                if (currentAmount < 0) {
                    amountInput.value = Math.abs(currentAmount);
                }
                // Update helper text
                if (type === 'deposit') {
                    amountInput.nextElementSibling.textContent = 'Amount will be added to user balance.';
                } else {
                    amountInput.nextElementSibling.textContent = 'Enter a positive or negative amount as needed.';
                }
            }
        });
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', loadTransactionsData);