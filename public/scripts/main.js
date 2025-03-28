// Main JavaScript for common functionality

document.addEventListener('DOMContentLoaded', function() {
  setupSidebar();
  setupModals();
});

/**
 * Setup sidebar toggle functionality
 */
function setupSidebar() {
  const toggleBtn = document.getElementById('toggle-sidebar');
  const sidebar = document.getElementById('sidebar');
  
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', function() {
      sidebar.classList.toggle('show');
    });
    
    // Handle active nav links
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      if ((currentPath === '/' && link.getAttribute('href') === '/') || 
          (currentPath !== '/' && link.getAttribute('href') === currentPath)) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
      const isMobile = window.innerWidth < 768;
      const isClickInsideSidebar = sidebar.contains(event.target);
      const isClickOnToggleBtn = toggleBtn.contains(event.target);
      
      if (isMobile && !isClickInsideSidebar && !isClickOnToggleBtn && sidebar.classList.contains('show')) {
        sidebar.classList.remove('show');
      }
    });
  }
}

/**
 * Setup modals functionality
 */
function setupModals() {
  // Add Funds Modal
  const addFundsModal = document.getElementById('add-funds-modal');
  
  if (addFundsModal) {
    const closeButtons = addFundsModal.querySelectorAll('.modal-close, .modal-cancel');
    const addFundsForm = document.getElementById('add-funds-form');
    
    // Close modal function
    const closeModal = () => {
      addFundsModal.classList.remove('show');
    };
    
    // Handle clicks on close buttons
    closeButtons.forEach(button => {
      button.addEventListener('click', closeModal);
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
      if (event.target === addFundsModal) {
        closeModal();
      }
    });
    
    // Handle form submission
    if (addFundsForm) {
      addFundsForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const userId = parseInt(document.getElementById('user-id').value);
        const amount = parseFloat(document.getElementById('amount').value);
        const type = document.getElementById('type').value;
        const notes = document.getElementById('notes').value;
        
        // Validate form
        if (!userId || isNaN(userId) || !amount || isNaN(amount)) {
          showToast('error', 'Please enter a valid amount');
          return;
        }
        
        try {
          // Create transaction
          const transactionData = {
            userId,
            amount: type === 'withdrawal' ? -amount : amount,
            type,
            notes: notes || null
          };
          
          const transaction = await createTransaction(transactionData);
          
          showToast('success', `Successfully ${type === 'withdrawal' ? 'withdrew' : 'added'} $${amount.toFixed(2)}`);
          closeModal();
          
          // Refresh page to show updated data
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } catch (error) {
          showToast('error', error.message || 'Failed to process transaction');
        }
      });
    }
  }
}

/**
 * Show a toast notification
 * @param {string} type - The type of toast ('success', 'error', 'info', 'warning')
 * @param {string} message - The message to display
 * @param {number} duration - Duration in milliseconds to show toast
 */
function showToast(type, message, duration = 3000) {
  // Create toast container if it doesn't exist
  let toastContainer = document.getElementById('toast-container');
  
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.position = 'fixed';
    toastContainer.style.top = '20px';
    toastContainer.style.right = '20px';
    toastContainer.style.zIndex = '9999';
    document.body.appendChild(toastContainer);
  }
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.style.backgroundColor = type === 'success' ? 'var(--success)' : 
                                type === 'error' ? 'var(--danger)' : 
                                type === 'warning' ? 'var(--warning)' : 'var(--primary)';
  toast.style.color = 'white';
  toast.style.padding = '12px 16px';
  toast.style.borderRadius = 'var(--radius)';
  toast.style.marginBottom = '10px';
  toast.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
  toast.style.display = 'flex';
  toast.style.alignItems = 'center';
  toast.style.justifyContent = 'space-between';
  toast.style.animation = 'slideInRight 0.3s forwards';
  
  // Add toast content
  const icon = document.createElement('i');
  icon.className = type === 'success' ? 'fas fa-check-circle' : 
                   type === 'error' ? 'fas fa-exclamation-circle' : 
                   type === 'warning' ? 'fas fa-exclamation-triangle' : 'fas fa-info-circle';
  icon.style.marginRight = '8px';
  
  const messageElement = document.createElement('span');
  messageElement.textContent = message;
  
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '&times;';
  closeBtn.style.background = 'none';
  closeBtn.style.border = 'none';
  closeBtn.style.color = 'white';
  closeBtn.style.marginLeft = '8px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.fontSize = '20px';
  
  toast.appendChild(icon);
  toast.appendChild(messageElement);
  toast.appendChild(closeBtn);
  
  // Add toast to container
  toastContainer.appendChild(toast);
  
  // Add CSS animation
  if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Close toast function
  const closeToast = () => {
    toast.style.animation = 'slideOutRight 0.3s forwards';
    setTimeout(() => {
      if (toastContainer.contains(toast)) {
        toastContainer.removeChild(toast);
      }
      
      // Remove container if empty
      if (toastContainer.children.length === 0) {
        document.body.removeChild(toastContainer);
      }
    }, 300);
  };
  
  // Close on click
  closeBtn.addEventListener('click', closeToast);
  
  // Auto close after duration
  setTimeout(closeToast, duration);
}

/**
 * Format currency value
 * @param {number} value - The value to format as currency
 * @returns {string} - Formatted currency string
 */
function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
}

/**
 * Format date to a readable string
 * @param {string|Date} date - The date to format
 * @returns {string} - Formatted date string
 */
function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Get initials from a name
 * @param {string} name - The name to get initials from
 * @returns {string} - Initials (up to 2 characters)
 */
function getInitials(name) {
  if (!name) return '?';
  
  const names = name.split(' ');
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
}

/**
 * Open Add Funds modal for a specific user
 * @param {Object} user - The user to add funds for
 */
function openAddFundsModal(user) {
  const modal = document.getElementById('add-funds-modal');
  const userIdField = document.getElementById('user-id');
  const userNameField = document.getElementById('user-name');
  const amountField = document.getElementById('amount');
  const notesField = document.getElementById('notes');
  
  if (modal && userIdField && userNameField) {
    // Reset form
    userIdField.value = user.id;
    userNameField.value = user.name;
    amountField.value = '';
    if (notesField) notesField.value = '';
    
    // Show modal
    modal.classList.add('show');
    
    // Focus amount field
    if (amountField) {
      setTimeout(() => amountField.focus(), 100);
    }
  }
}