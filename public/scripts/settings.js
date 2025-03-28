// Settings page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Set up profile settings form
  setupProfileSettingsForm();
  
  // Set up notification settings form
  setupNotificationSettingsForm();
});

/**
 * Set up profile settings form submission handling
 */
function setupProfileSettingsForm() {
  const profileForm = document.getElementById('profile-settings-form');
  
  if (!profileForm) return;
  
  profileForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Get form data
    const name = document.getElementById('admin-name').value;
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    const passwordConfirm = document.getElementById('admin-password-confirm').value;
    
    // Validate form
    if (!name || !email) {
      showToast('error', 'Please fill out all required fields');
      return;
    }
    
    // If password is provided, validate it
    if (password) {
      if (password.length < 8) {
        showToast('error', 'Password must be at least 8 characters long');
        return;
      }
      
      if (password !== passwordConfirm) {
        showToast('error', 'Passwords do not match');
        return;
      }
    }
    
    // In a real app, this would update the admin user profile
    // For demo purposes, we'll just show a success message
    
    // Show success message
    showToast('success', 'Profile settings updated successfully');
    
    // Clear password fields
    document.getElementById('admin-password').value = '';
    document.getElementById('admin-password-confirm').value = '';
  });
}

/**
 * Set up notification settings form submission handling
 */
function setupNotificationSettingsForm() {
  const notificationForm = document.getElementById('notification-settings-form');
  
  if (!notificationForm) return;
  
  notificationForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Get form data
    const emailNotifications = document.getElementById('email-notifications').checked;
    const transactionAlerts = document.getElementById('transaction-alerts').checked;
    const newUserAlerts = document.getElementById('new-user-alerts').checked;
    
    // In a real app, this would update the notification settings
    // For demo purposes, we'll just show a success message
    
    // Show success message
    showToast('success', 'Notification preferences updated successfully');
  });
}