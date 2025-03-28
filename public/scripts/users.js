// Users page specific JavaScript

document.addEventListener('DOMContentLoaded', async function() {
  try {
    // Load users data
    await loadUsersData();
  } catch (error) {
    console.error('Error loading users data:', error);
    showToast('error', 'Failed to load users data');
  }
});

/**
 * Load users data and populate the table
 */
async function loadUsersData() {
  try {
    // Fetch users data
    const users = await getUsers();
    
    // Load users table
    loadUsersTable(users);
  } catch (error) {
    console.error('Error loading users data:', error);
    throw error;
  }
}

/**
 * Load users table with user data
 * @param {Array} users - List of users to display
 */
function loadUsersTable(users) {
  const tableBody = document.getElementById('users-table-body');
  
  if (!tableBody) return;
  
  // Clear existing content
  tableBody.innerHTML = '';
  
  if (users.length === 0) {
    const emptyRow = document.createElement('tr');
    emptyRow.innerHTML = `
      <td colspan="5" class="text-center">No users found</td>
    `;
    tableBody.appendChild(emptyRow);
    return;
  }
  
  // Sort users by name
  const sortedUsers = [...users].sort((a, b) => a.name.localeCompare(b.name));
  
  // Create table rows for each user
  sortedUsers.forEach(user => {
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
          <button class="btn btn-sm btn-success email-btn" data-user-id="${user.id}" title="Send Email">
            <i class="fas fa-envelope"></i>
          </button>
          <button class="btn btn-sm btn-outline view-btn" data-user-id="${user.id}" title="View Details">
            <i class="fas fa-eye"></i>
          </button>
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
    
    // Add event listener to Email button
    const emailBtn = row.querySelector('.email-btn');
    if (emailBtn) {
      emailBtn.addEventListener('click', () => {
        // Redirect to email page with user pre-selected
        window.location.href = `/email-notifications.html?user=${user.id}`;
      });
    }
    
    // Add event listener to View button
    const viewBtn = row.querySelector('.view-btn');
    if (viewBtn) {
      viewBtn.addEventListener('click', () => {
        // For now just show a toast with user details
        showToast('info', `Viewing details for ${user.name}`);
        
        // In a real app, this would redirect to a user detail page
        // or open a modal with user details
      });
    }
  });
}