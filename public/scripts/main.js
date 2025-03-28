/**
 * Main JavaScript file for the Broker Admin Dashboard
 * 
 * This file contains common functions used throughout the application.
 */

/**
 * Set up sidebar toggle functionality
 */
function setupSidebar() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('sidebar-collapsed');
        });
    }
    
    // Handle sidebar item active state based on current page
    const currentPath = window.location.pathname;
    const menuItems = document.querySelectorAll('.sidebar-nav li');
    
    menuItems.forEach(item => {
        const link = item.querySelector('a');
        if (link && (currentPath.includes(link.getAttribute('href')) || 
            (currentPath.endsWith('/') && link.getAttribute('href') === 'index.html'))) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

/**
 * Set up modals functionality
 */
function setupModals() {
    // Generic function to handle any modal on the page
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        // Get close button inside this modal
        const closeBtn = modal.querySelector('.close-btn');
        const cancelBtn = modal.querySelector('.cancel-btn');
        
        // Close modal when close button is clicked
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }
        
        // Close modal when cancel button is clicked
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }
        
        // Close modal when clicking outside of it
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

/**
 * Show a toast notification
 * @param {string} type - The type of toast ('success', 'error', 'info', 'warning')
 * @param {string} title - The title for the toast
 * @param {string} message - The message to display
 * @param {number} duration - Duration in milliseconds to show toast
 */
function showToast(type, title, message, duration = 3000) {
    const toastContainer = document.getElementById('toast-container');
    
    if (!toastContainer) {
        // Create toast container if it doesn't exist
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Get appropriate icon based on type
    let iconClass = '';
    switch (type) {
        case 'success':
            iconClass = 'fa-check-circle';
            break;
        case 'error':
            iconClass = 'fa-exclamation-circle';
            break;
        case 'warning':
            iconClass = 'fa-exclamation-triangle';
            break;
        case 'info':
        default:
            iconClass = 'fa-info-circle';
            break;
    }
    
    // Construct toast content
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${iconClass}"></i>
        </div>
        <div class="toast-message">
            <div class="toast-title">${title}</div>
            <div class="toast-content">${message}</div>
        </div>
    `;
    
    // Add toast to container
    toastContainer.appendChild(toast);
    
    // Remove toast after specified duration
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 300);
    }, duration);
}

/**
 * Format currency value
 * @param {number} value - The value to format as currency
 * @returns {string} - Formatted currency string
 */
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

/**
 * Format date to a readable string
 * @param {Date|string} date - The date to format
 * @returns {string} - Formatted date string
 */
function formatDate(date) {
    if (!date) return 'N/A';
    
    const dateObj = date instanceof Date ? date : new Date(date);
    
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(dateObj);
}

/**
 * Get initials from a name
 * @param {string} name - The name to get initials from
 * @returns {string} - Initials (up to 2 characters)
 */
function getInitials(name) {
    if (!name) return 'N/A';
    
    return name
        .split(' ')
        .map(part => part.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('');
}

/**
 * Open Add Funds modal for a specific user
 * @param {Object} user - The user to add funds for
 */
function openAddFundsModal(user) {
    const modal = document.getElementById('add-funds-modal');
    
    if (modal && user) {
        // Populate form fields
        document.getElementById('user-id-input').value = user.id;
        document.getElementById('user-name-display').value = user.fullName;
        document.getElementById('current-balance-display').value = formatCurrency(user.balance);
        document.getElementById('amount-input').value = '';
        document.getElementById('notes-input').value = '';
        
        // Reset checkboxes to default
        document.getElementById('send-email-checkbox').checked = true;
        
        // Show the modal
        modal.classList.add('active');
    }
}

/**
 * Setup add funds form submission
 */
function setupAddFundsForm() {
    const form = document.getElementById('add-funds-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const userId = parseInt(document.getElementById('user-id-input').value);
            const amount = parseFloat(document.getElementById('amount-input').value);
            const notes = document.getElementById('notes-input').value;
            const sendEmail = document.getElementById('send-email-checkbox').checked;
            
            if (isNaN(userId) || isNaN(amount)) {
                showToast('error', 'Invalid Input', 'Please enter a valid amount.');
                return;
            }
            
            if (amount <= 0) {
                showToast('error', 'Invalid Amount', 'Amount must be greater than zero.');
                return;
            }
            
            // Create transaction
            const transaction = createTransaction({
                userId: userId,
                amount: amount,
                type: 'deposit',
                status: 'completed',
                notes: notes
            });
            
            if (transaction) {
                // Close the modal
                document.getElementById('add-funds-modal').classList.remove('active');
                
                // Show success message
                showToast('success', 'Funds Added', `Successfully added ${formatCurrency(amount)} to user account.`);
                
                // Reload data on the current page if needed
                if (typeof loadDashboardData === 'function') {
                    loadDashboardData();
                } else if (typeof loadUsersData === 'function') {
                    loadUsersData();
                } else if (typeof loadTransactionsData === 'function') {
                    loadTransactionsData();
                }
            }
        });
    }
}

/**
 * Initialize common functionality on document ready
 */
document.addEventListener('DOMContentLoaded', function() {
    setupSidebar();
    setupModals();
    setupAddFundsForm();
});