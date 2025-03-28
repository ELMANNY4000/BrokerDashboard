// Dashboard specific JavaScript

document.addEventListener('DOMContentLoaded', async function() {
  try {
    // Load dashboard data
    await loadDashboardData();
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    showToast('error', 'Failed to load dashboard data');
  }
});

/**
 * Load all dashboard data
 */
async function loadDashboardData() {
  try {
    // Load users and transactions in parallel
    const [users, transactions] = await Promise.all([
      getUsers(),
      getTransactions()
    ]);
    
    // Update stats cards
    updateStatsCards(users, transactions);
    
    // Load recent users table
    loadRecentUsers(users);
    
    // Load recent transactions table
    loadRecentTransactions(users, transactions);
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    throw error;
  }
}

/**
 * Update stats cards with current data
 * @param {Array} users - List of users
 * @param {Array} transactions - List of transactions
 */
function updateStatsCards(users, transactions) {
  const totalUsersElement = document.getElementById('total-users');
  const totalBalanceElement = document.getElementById('total-balance');
  const totalTransactionsElement = document.getElementById('total-transactions');
  const emailOpenRateElement = document.getElementById('email-open-rate');
  
  if (totalUsersElement) {
    totalUsersElement.textContent = users.length;
  }
  
  if (totalBalanceElement) {
    const totalBalance = users.reduce((sum, user) => sum + user.balance, 0);
    totalBalanceElement.textContent = formatCurrency(totalBalance);
  }
  
  if (totalTransactionsElement) {
    totalTransactionsElement.textContent = transactions.length;
  }
  
  if (emailOpenRateElement) {
    // Placeholder for email open rate
    emailOpenRateElement.textContent = '68%';
  }
}

/**
 * Load recent users table
 * @param {Array} users - List of users
 */
function loadRecentUsers(users) {
  const tableBody = document.getElementById('recent-users-body');
  
  if (!tableBody) return;
  
  // Sort users by most recently created first and take top 5
  const recentUsers = [...users]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);
  
  // Clear existing content
  tableBody.innerHTML = '';
  
  if (recentUsers.length === 0) {
    const emptyRow = document.createElement('tr');
    emptyRow.innerHTML = `
      <td colspan="5" class="text-center">No users found</td>
    `;
    tableBody.appendChild(emptyRow);
    return;
  }
  
  // Create table rows for each user
  recentUsers.forEach(user => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>
        <div class="table-user">
          <div class="user-avatar">${getInitials(user.name)}</div>
          <div class="user-info">
            <div class="user-name">${user.name}</div>
            <div class="user-email">${user.username}</div>
          </div>
        </div>
      </td>
      <td>${user.email}</td>
      <td>
        <span class="status-badge ${user.status === 'active' ? 'status-active' : 'status-inactive'}">
          ${user.status}
        </span>
      </td>
      <td>${formatCurrency(user.balance)}</td>
      <td>
        <div class="action-buttons">
          <button class="btn btn-sm btn-primary add-funds-btn" data-user-id="${user.id}" title="Add Funds">
            <i class="fas fa-dollar-sign"></i>
          </button>
          <a href="/users.html?user=${user.id}" class="btn btn-sm btn-outline" title="View Details">
            <i class="fas fa-eye"></i>
          </a>
        </div>
      </td>
    `;
    
    tableBody.appendChild(row);
    
    // Add event listener to Add Funds button
    const addFundsBtn = row.querySelector('.add-funds-btn');
    if (addFundsBtn) {
      addFundsBtn.addEventListener('click', () => {
        openAddFundsModal(user);
      });
    }
  });
}

/**
 * Load recent transactions table
 * @param {Array} users - List of users
 * @param {Array} transactions - List of transactions
 */
function loadRecentTransactions(users, transactions) {
  const tableBody = document.getElementById('recent-transactions-body');
  
  if (!tableBody) return;
  
  // Create user map for quick lookup
  const userMap = users.reduce((map, user) => {
    map[user.id] = user;
    return map;
  }, {});
  
  // Sort transactions by most recent first and take top 5
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);
  
  // Clear existing content
  tableBody.innerHTML = '';
  
  if (recentTransactions.length === 0) {
    const emptyRow = document.createElement('tr');
    emptyRow.innerHTML = `
      <td colspan="5" class="text-center">No transactions found</td>
    `;
    tableBody.appendChild(emptyRow);
    return;
  }
  
  // Create table rows for each transaction
  recentTransactions.forEach(transaction => {
    const user = userMap[transaction.userId];
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>
        <div class="table-user">
          <div class="user-avatar">${user ? getInitials(user.name) : '?'}</div>
          <div class="user-info">
            <div class="user-name">${user ? user.name : 'Unknown User'}</div>
            <div class="user-email">${user ? user.email : ''}</div>
          </div>
        </div>
      </td>
      <td class="transaction-type">${transaction.type}</td>
      <td class="transaction-amount ${transaction.amount >= 0 ? 'positive' : 'negative'}">
        ${formatCurrency(transaction.amount)}
      </td>
      <td>
        <span class="status-badge status-active">Completed</span>
      </td>
      <td class="transaction-date">
        ${formatDate(transaction.createdAt || new Date())}
      </td>
    `;
    
    tableBody.appendChild(row);
  });
}