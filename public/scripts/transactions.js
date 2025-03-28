// Transactions page specific JavaScript

document.addEventListener('DOMContentLoaded', async function() {
  try {
    // Load transactions data
    await loadTransactionsData();
  } catch (error) {
    console.error('Error loading transactions data:', error);
    showToast('error', 'Failed to load transactions data');
  }
});

/**
 * Load transactions data and populate the table
 */
async function loadTransactionsData() {
  try {
    // Fetch transactions and users data in parallel
    const [transactions, users] = await Promise.all([
      getTransactions(),
      getUsers()
    ]);
    
    // Load transactions table
    loadTransactionsTable(transactions, users);
  } catch (error) {
    console.error('Error loading transactions data:', error);
    throw error;
  }
}

/**
 * Load transactions table with transaction data
 * @param {Array} transactions - List of transactions to display
 * @param {Array} users - List of users for reference
 */
function loadTransactionsTable(transactions, users) {
  const tableBody = document.getElementById('transactions-table-body');
  
  if (!tableBody) return;
  
  // Create user map for quick lookup
  const userMap = users.reduce((map, user) => {
    map[user.id] = user;
    return map;
  }, {});
  
  // Clear existing content
  tableBody.innerHTML = '';
  
  if (transactions.length === 0) {
    const emptyRow = document.createElement('tr');
    emptyRow.innerHTML = `
      <td colspan="6" class="text-center">No transactions found</td>
    `;
    tableBody.appendChild(emptyRow);
    return;
  }
  
  // Sort transactions by most recent first
  const sortedTransactions = [...transactions]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  
  // Create table rows for each transaction
  sortedTransactions.forEach(transaction => {
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
      <td>${transaction.notes || '-'}</td>
    `;
    
    tableBody.appendChild(row);
  });
}