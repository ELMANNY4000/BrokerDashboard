/**
 * Email Notifications JavaScript for the Broker Admin Dashboard
 * 
 * This file contains functions specific to the email notifications page.
 */

// Globals
let selectedRecipients = [];
let filteredUserId = null;
let allUsers = [];

/**
 * Load email notifications data and populate the page
 * @param {string|null} selectedUserId - ID of pre-selected user if provided
 */
async function loadEmailNotificationsData(selectedUserId) {
    try {
        // Check if we're filtering by user ID
        const urlParams = new URLSearchParams(window.location.search);
        filteredUserId = urlParams.get('userId') ? parseInt(urlParams.get('userId')) : selectedUserId;
        
        // Get all users
        allUsers = getUsers();
        
        // Get email notifications
        const emailNotifications = getEmailNotifications();
        
        // Populate custom recipients list
        populateCustomRecipientsList(allUsers, filteredUserId);
        
        // Show user filter card if filtering by user
        if (filteredUserId) {
            showUserFilterCard(filteredUserId);
        }
        
        // Load email history table
        loadEmailHistoryTable(emailNotifications, allUsers);
        
        // Set up email form submission handling
        setupEmailForm();
    } catch (error) {
        console.error('Error loading email notifications data:', error);
        showToast('error', 'Data Loading Error', 'Failed to load email data. Please try refreshing the page.');
    }
}

/**
 * Populate the custom recipients list with users
 * @param {Array} users - List of users to display as potential recipients
 * @param {string|null} selectedUserId - ID of pre-selected user if provided
 */
function populateCustomRecipientsList(users, selectedUserId) {
    const recipientsContainer = document.getElementById('custom-recipients-list');
    if (!recipientsContainer) return;
    
    // Clear existing content
    recipientsContainer.innerHTML = '';
    
    // Filter to active users and sort alphabetically
    const activeUsers = users
        .filter(user => user.status === 'active')
        .sort((a, b) => a.fullName.localeCompare(b.fullName));
    
    // Create checkbox for each user
    activeUsers.forEach(user => {
        const recipientItem = document.createElement('div');
        recipientItem.className = 'form-check recipient-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `recipient-${user.id}`;
        checkbox.className = 'form-check-input recipient-checkbox';
        checkbox.value = user.id;
        checkbox.dataset.email = user.email;
        checkbox.dataset.name = user.fullName;
        
        // Check if this user is pre-selected
        if (selectedUserId && user.id === parseInt(selectedUserId)) {
            checkbox.checked = true;
            selectedRecipients.push({
                id: user.id,
                email: user.email,
                name: user.fullName
            });
        }
        
        const label = document.createElement('label');
        label.htmlFor = `recipient-${user.id}`;
        label.className = 'form-label';
        label.innerHTML = `
            <div class="recipient-info">
                <span class="recipient-name">${user.fullName}</span>
                <span class="recipient-email">${user.email}</span>
            </div>
        `;
        
        // Add event listener to checkbox
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                selectedRecipients.push({
                    id: user.id,
                    email: user.email,
                    name: user.fullName
                });
            } else {
                selectedRecipients = selectedRecipients.filter(recipient => recipient.id !== user.id);
            }
        });
        
        recipientItem.appendChild(checkbox);
        recipientItem.appendChild(label);
        recipientsContainer.appendChild(recipientItem);
    });
    
    // Add select all/none controls
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'recipients-controls';
    
    const selectAllBtn = document.createElement('button');
    selectAllBtn.type = 'button';
    selectAllBtn.className = 'btn btn-sm btn-outline-primary';
    selectAllBtn.textContent = 'Select All';
    selectAllBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const checkboxes = document.querySelectorAll('.recipient-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = true;
            
            // Trigger change event
            const changeEvent = new Event('change');
            checkbox.dispatchEvent(changeEvent);
        });
    });
    
    const selectNoneBtn = document.createElement('button');
    selectNoneBtn.type = 'button';
    selectNoneBtn.className = 'btn btn-sm btn-outline-secondary';
    selectNoneBtn.textContent = 'Select None';
    selectNoneBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const checkboxes = document.querySelectorAll('.recipient-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
            
            // Trigger change event
            const changeEvent = new Event('change');
            checkbox.dispatchEvent(changeEvent);
        });
    });
    
    controlsDiv.appendChild(selectAllBtn);
    controlsDiv.appendChild(selectNoneBtn);
    
    recipientsContainer.parentNode.insertBefore(controlsDiv, recipientsContainer);
    
    // Set up recipient type radio buttons
    const recipientAllRadio = document.getElementById('recipient-all');
    const recipientCustomRadio = document.getElementById('recipient-custom');
    const customRecipientsContainer = document.getElementById('custom-recipients-container');
    
    if (recipientAllRadio && recipientCustomRadio && customRecipientsContainer) {
        // Show/hide recipients list based on selection
        recipientAllRadio.addEventListener('change', function() {
            if (this.checked) {
                customRecipientsContainer.style.display = 'none';
            }
        });
        
        recipientCustomRadio.addEventListener('change', function() {
            if (this.checked) {
                customRecipientsContainer.style.display = 'block';
            }
        });
    }
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
 * Load email history table with email notification data
 * @param {Array} emailNotifications - List of email notifications to display
 * @param {Array} users - List of users for reference
 */
function loadEmailHistoryTable(emailNotifications, users) {
    const tableBody = document.getElementById('email-history-table');
    if (!tableBody) return;
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Sort email notifications by creation date (newest first)
    const sortedEmails = [...emailNotifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Filter by user if needed
    const filteredEmails = filteredUserId 
        ? sortedEmails.filter(email => {
            const user = users.find(u => u.id === filteredUserId);
            return user && email.recipientEmails.includes(user.email);
        }) 
        : sortedEmails;
    
    // Add rows to table
    filteredEmails.forEach(email => {
        const row = document.createElement('tr');
        row.style.cursor = 'pointer';
        
        // Recipients cell
        const recipientsCell = document.createElement('td');
        if (email.recipientEmails.length > 3) {
            recipientsCell.textContent = `${email.recipientEmails.slice(0, 3).join(', ')} and ${email.recipientEmails.length - 3} more`;
        } else {
            recipientsCell.textContent = email.recipientEmails.join(', ');
        }
        
        // Subject cell
        const subjectCell = document.createElement('td');
        subjectCell.textContent = email.subject;
        
        // Status cell
        const statusCell = document.createElement('td');
        let statusClass;
        
        switch (email.status) {
            case 'sent':
                statusClass = 'status-active';
                break;
            case 'failed':
                statusClass = 'status-inactive';
                break;
            default:
                statusClass = 'status-pending';
        }
        
        statusCell.innerHTML = `
            <span class="status-badge ${statusClass}">${email.status}</span>
        `;
        
        // Date cell
        const dateCell = document.createElement('td');
        dateCell.textContent = formatDate(email.createdAt);
        
        // Add cells to row
        row.appendChild(recipientsCell);
        row.appendChild(subjectCell);
        row.appendChild(statusCell);
        row.appendChild(dateCell);
        
        // Add click event to show email details
        row.addEventListener('click', function() {
            showEmailDetails(email);
        });
        
        // Add row to table
        tableBody.appendChild(row);
    });
    
    // Show empty state if no emails
    if (filteredEmails.length === 0) {
        const emptyRow = document.createElement('tr');
        const emptyCell = document.createElement('td');
        emptyCell.colSpan = 4;
        emptyCell.textContent = 'No email notifications found';
        emptyCell.style.textAlign = 'center';
        emptyCell.style.padding = '2rem';
        emptyRow.appendChild(emptyCell);
        tableBody.appendChild(emptyRow);
    }
}

/**
 * Show email details in a modal
 * @param {Object} email - Email notification to display
 */
function showEmailDetails(email) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-header">
                <h3 class="modal-title">Email Details</h3>
                <button class="close-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="email-details">
                    <div class="email-details-row">
                        <strong>Recipients:</strong>
                        <span>${email.recipientEmails.join(', ')}</span>
                    </div>
                    <div class="email-details-row">
                        <strong>Subject:</strong>
                        <span>${email.subject}</span>
                    </div>
                    <div class="email-details-row">
                        <strong>Status:</strong>
                        <span class="status-badge status-${email.status === 'sent' ? 'active' : email.status === 'failed' ? 'inactive' : 'pending'}">${email.status}</span>
                    </div>
                    <div class="email-details-row">
                        <strong>Date:</strong>
                        <span>${formatDate(email.createdAt)}</span>
                    </div>
                    <div class="email-details-content">
                        <strong>Content:</strong>
                        <div class="email-content-preview">${email.content.replace(/\n/g, '<br>')}</div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary close-btn">Close</button>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.appendChild(modal);
    
    // Add close event listeners
    const closeBtns = modal.querySelectorAll('.close-btn');
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            document.body.removeChild(modal);
        });
    });
    
    // Close when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

/**
 * Set up email form submission handling
 */
function setupEmailForm() {
    const emailForm = document.getElementById('email-form');
    const emailPreviewModal = document.getElementById('email-preview-modal');
    
    if (emailForm) {
        emailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const recipientType = document.querySelector('input[name="recipient-type"]:checked').value;
            const subject = document.getElementById('email-subject').value;
            const content = document.getElementById('email-content').value;
            
            // Validate form
            if (!subject || !content) {
                showToast('error', 'Invalid Input', 'Please fill in all required fields.');
                return;
            }
            
            // Get recipient emails
            let recipientEmails = [];
            
            if (recipientType === 'all') {
                // All active users
                recipientEmails = allUsers
                    .filter(user => user.status === 'active')
                    .map(user => user.email);
            } else {
                // Custom recipients
                if (selectedRecipients.length === 0) {
                    showToast('error', 'No Recipients', 'Please select at least one recipient.');
                    return;
                }
                
                recipientEmails = selectedRecipients.map(recipient => recipient.email);
            }
            
            // Show preview
            if (emailPreviewModal) {
                // Set preview content
                document.getElementById('preview-recipients').textContent = recipientEmails.length > 3 
                    ? `${recipientEmails.slice(0, 3).join(', ')} and ${recipientEmails.length - 3} more`
                    : recipientEmails.join(', ');
                    
                document.getElementById('preview-subject').textContent = subject;
                document.getElementById('preview-content').innerHTML = content.replace(/\n/g, '<br>');
                
                // Show preview modal
                emailPreviewModal.classList.add('active');
                
                // Add send email button event listener
                const sendEmailBtn = document.getElementById('send-email-btn');
                if (sendEmailBtn) {
                    sendEmailBtn.onclick = function() {
                        sendEmail(recipientEmails, subject, content);
                    };
                }
            } else {
                // If no preview modal, send directly
                sendEmail(recipientEmails, subject, content);
            }
        });
    }
}

/**
 * Send email notification
 * @param {Array} recipientEmails - List of recipient email addresses
 * @param {string} subject - Email subject
 * @param {string} content - Email content
 */
function sendEmail(recipientEmails, subject, content) {
    try {
        // Create email notification
        const emailNotification = createEmailNotification({
            recipientEmails: recipientEmails,
            subject: subject,
            content: content,
            status: 'sent'
        });
        
        if (emailNotification) {
            // Close preview modal if open
            const modal = document.getElementById('email-preview-modal');
            if (modal) {
                modal.classList.remove('active');
            }
            
            // Show success message
            showToast('success', 'Email Sent', `Email has been sent to ${recipientEmails.length} recipient(s).`);
            
            // Reset form
            document.getElementById('email-form').reset();
            
            // If filtering by user, check that user's checkbox
            if (filteredUserId) {
                const checkbox = document.getElementById(`recipient-${filteredUserId}`);
                if (checkbox) {
                    checkbox.checked = true;
                    
                    // Trigger change event
                    const changeEvent = new Event('change');
                    checkbox.dispatchEvent(changeEvent);
                }
                
                // Also check custom recipients radio
                const customRadio = document.getElementById('recipient-custom');
                if (customRadio) {
                    customRadio.checked = true;
                    
                    // Trigger change event
                    const changeEvent = new Event('change');
                    customRadio.dispatchEvent(changeEvent);
                }
            }
            
            // Clear selected recipients
            selectedRecipients = [];
            if (filteredUserId) {
                const user = getUserById(filteredUserId);
                if (user) {
                    selectedRecipients.push({
                        id: user.id,
                        email: user.email,
                        name: user.fullName
                    });
                }
            }
            
            // Reload email history
            loadEmailHistoryTable(getEmailNotifications(), allUsers);
        }
    } catch (error) {
        console.error('Error sending email:', error);
        showToast('error', 'Email Failed', 'Failed to send email. Please try again.');
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadEmailNotificationsData();
});