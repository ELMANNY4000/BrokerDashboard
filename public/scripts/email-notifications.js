// Email Notifications page specific JavaScript

document.addEventListener('DOMContentLoaded', async function() {
  try {
    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const selectedUserId = urlParams.get('user');
    
    // Load email notifications data
    await loadEmailNotificationsData(selectedUserId);
    
    // Set up form handling
    setupEmailForm();
  } catch (error) {
    console.error('Error loading email notifications data:', error);
    showToast('error', 'Failed to load email notifications data');
  }
});

/**
 * Load email notifications data and populate the page
 * @param {string|null} selectedUserId - ID of pre-selected user if provided
 */
async function loadEmailNotificationsData(selectedUserId) {
  try {
    // Fetch email notifications and users data in parallel
    const [emailNotifications, users] = await Promise.all([
      getEmailNotifications(),
      getUsers()
    ]);
    
    // Populate custom recipients list
    populateCustomRecipientsList(users, selectedUserId);
    
    // Load email history table
    loadEmailHistoryTable(emailNotifications, users);
  } catch (error) {
    console.error('Error loading email notifications data:', error);
    throw error;
  }
}

/**
 * Populate the custom recipients list with users
 * @param {Array} users - List of users to display as potential recipients
 * @param {string|null} selectedUserId - ID of pre-selected user if provided
 */
function populateCustomRecipientsList(users, selectedUserId) {
  const customRecipientsList = document.getElementById('custom-recipients-list');
  const recipientTypeSelect = document.getElementById('recipient-type');
  const customRecipientsGroup = document.getElementById('custom-recipients-group');
  
  if (!customRecipientsList || !recipientTypeSelect || !customRecipientsGroup) return;
  
  // Sort users by name
  const sortedUsers = [...users].sort((a, b) => a.name.localeCompare(b.name));
  
  // Clear existing content
  customRecipientsList.innerHTML = '';
  
  // Create checkbox for each user
  sortedUsers.forEach(user => {
    const checkbox = document.createElement('div');
    checkbox.className = 'checkbox-container';
    checkbox.innerHTML = `
      <input type="checkbox" id="recipient-${user.id}" name="recipients[]" value="${user.id}" 
        ${selectedUserId && selectedUserId == user.id ? 'checked' : ''}>
      <label class="checkbox-label" for="recipient-${user.id}">${user.name} (${user.email})</label>
    `;
    
    customRecipientsList.appendChild(checkbox);
  });
  
  // If a user was pre-selected, set the recipient type to custom
  if (selectedUserId) {
    recipientTypeSelect.value = 'custom';
    customRecipientsGroup.style.display = 'block';
  }
  
  // Set up recipient type change handler
  recipientTypeSelect.addEventListener('change', function() {
    if (this.value === 'custom') {
      customRecipientsGroup.style.display = 'block';
    } else {
      customRecipientsGroup.style.display = 'none';
    }
  });
}

/**
 * Load email history table with email notification data
 * @param {Array} emailNotifications - List of email notifications to display
 * @param {Array} users - List of users for reference
 */
function loadEmailHistoryTable(emailNotifications, users) {
  const tableBody = document.getElementById('email-history-table-body');
  
  if (!tableBody) return;
  
  // Create user map for quick lookup
  const userMap = users.reduce((map, user) => {
    map[user.id] = user;
    return map;
  }, {});
  
  // Clear existing content
  tableBody.innerHTML = '';
  
  if (emailNotifications.length === 0) {
    const emptyRow = document.createElement('tr');
    emptyRow.innerHTML = `
      <td colspan="4" class="text-center">No email notifications found</td>
    `;
    tableBody.appendChild(emptyRow);
    return;
  }
  
  // Sort email notifications by most recent first
  const sortedNotifications = [...emailNotifications]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  
  // Create table rows for each email notification
  sortedNotifications.forEach(notification => {
    const row = document.createElement('tr');
    
    // Format recipients
    let recipientsText = 'All Users';
    
    if (notification.recipientIds && notification.recipientIds.length > 0) {
      const recipientNames = notification.recipientIds
        .map(id => userMap[id] ? userMap[id].name : 'Unknown')
        .slice(0, 3);
      
      const extraCount = notification.recipientIds.length - 3;
      
      recipientsText = recipientNames.join(', ');
      
      if (extraCount > 0) {
        recipientsText += ` and ${extraCount} more`;
      }
    }
    
    row.innerHTML = `
      <td>${notification.subject}</td>
      <td>${recipientsText}</td>
      <td>${formatDate(notification.createdAt || new Date())}</td>
      <td>68%</td>
    `;
    
    tableBody.appendChild(row);
  });
}

/**
 * Set up email form submission handling
 */
function setupEmailForm() {
  const emailForm = document.getElementById('email-form');
  
  if (!emailForm) return;
  
  emailForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    // Get form data
    const subject = document.getElementById('subject').value;
    const content = document.getElementById('content').value;
    const recipientType = document.getElementById('recipient-type').value;
    
    // Validate form
    if (!subject || !content) {
      showToast('error', 'Please fill out all required fields');
      return;
    }
    
    try {
      let recipientIds = [];
      
      // Handle different recipient types
      if (recipientType === 'custom') {
        // Get selected recipient checkboxes
        const selectedRecipients = document.querySelectorAll('input[name="recipients[]"]:checked');
        recipientIds = Array.from(selectedRecipients).map(checkbox => parseInt(checkbox.value));
        
        if (recipientIds.length === 0) {
          showToast('error', 'Please select at least one recipient');
          return;
        }
      }
      
      // Create email notification
      const emailData = {
        subject,
        content,
        recipientIds: recipientType === 'custom' ? recipientIds : null
      };
      
      // Show loading state
      const submitBtn = emailForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      
      // Send email notification
      const notification = await createEmailNotification(emailData);
      
      // Reset form
      emailForm.reset();
      
      // Show success message
      showToast('success', 'Email notification sent successfully');
      
      // Reload email history
      await loadEmailNotificationsData();
      
      // Reset button
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    } catch (error) {
      showToast('error', error.message || 'Failed to send email notification');
    }
  });
}