/**
 * Frontend JavaScript for CRUD Application
 * Handles API calls, UI interactions, and data management
 */

// Configuration - Update this with your Apps Script Web App URL
const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbwc5bLcu5_xm8Lmz5x702_TRH8q_0jwu1v6wDihblq5DaJBESQ6V7JdoLOKncl2Dw3j/exec';

// Global variables
let records = [];
let currentEditId = null;
// DOM Elements
const addForm = document.getElementById('addForm');
const editForm = document.getElementById('editForm');
const recordsTableBody = document.getElementById('recordsTableBody');
const refreshBtn = document.getElementById('refreshBtn');
const editModal = document.getElementById('editModal');
const deleteModal = document.getElementById('deleteModal');
const loadingMessage = document.getElementById('loadingMessage');
const emptyMessage = document.getElementById('emptyMessage');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Initialize the application
 */
function initializeApp() {
    // Load initial data
    loadRecords();
    
    // Set up event listeners
    setupEventListeners();
    
    // Show welcome message
    showToast('Welcome!', 'CRUD application loaded successfully', 'info');
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    // Form submissions
    addForm.addEventListener('submit', handleAddRecord);
    editForm.addEventListener('submit', handleEditRecord);
    
    // Button clicks
    refreshBtn.addEventListener('click', loadRecords);
    
    // Modal controls
    document.getElementById('closeModal').addEventListener('click', closeEditModal);
    document.getElementById('cancelEdit').addEventListener('click', closeEditModal);
    document.getElementById('closeDeleteModal').addEventListener('click', closeDeleteModal);
    document.getElementById('cancelDelete').addEventListener('click', closeDeleteModal);
    document.getElementById('confirmDelete').addEventListener('click', confirmDeleteRecord);
    
    // Close modals when clicking outside
    editModal.addEventListener('click', function(e) {
        if (e.target === editModal) closeEditModal();
    });
    
    deleteModal.addEventListener('click', function(e) {
        if (e.target === deleteModal) closeDeleteModal();
    });
}

/**
 * Load all records from the API
 */
async function loadRecords() {
    try {
        showLoading(true);
        
        const response = await fetch(API_BASE_URL);
        const result = await response.json();
        
        if (result.success) {
            records = result.data || [];
            renderRecords();
            showToast('Success', `Loaded ${records.length} records`, 'success');
        } else {
            throw new Error(result.error || 'Failed to load records');
        }
    } catch (error) {
        console.error('Error loading records:', error);
        showToast('Error', 'Failed to load records: ' + error.message, 'error');
        renderRecords(); // Show empty state
    } finally {
        showLoading(false);
    }
}

/**
 * Handle adding a new record
 */
async function handleAddRecord(e) {
    e.preventDefault();
    
    const formData = new FormData(addForm);
    const data = {
        name: formData.get('name').trim(),
        email: formData.get('email').trim(),
        phone: formData.get('phone').trim()
    };
    
    // Validate required fields
    if (!data.name || !data.email) {
        showToast('Error', 'Name and email are required', 'error');
        return;
    }
    
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast('Success', 'Record added successfully', 'success');
            addForm.reset();
            loadRecords(); // Refresh the list
        } else {
            throw new Error(result.error || 'Failed to add record');
        }
    } catch (error) {
        console.error('Error adding record:', error);
        showToast('Error', 'Failed to add record: ' + error.message, 'error');
    }
}

/**
 * Handle editing a record
 */
async function handleEditRecord(e) {
    e.preventDefault();
    
    const formData = new FormData(editForm);
    const data = {
        name: formData.get('name').trim(),
        email: formData.get('email').trim(),
        phone: formData.get('phone').trim()
    };
    
    // Validate required fields
    if (!data.name || !data.email) {
        showToast('Error', 'Name and email are required', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}?id=${currentEditId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast('Success', 'Record updated successfully', 'success');
            closeEditModal();
            loadRecords(); // Refresh the list
        } else {
            throw new Error(result.error || 'Failed to update record');
        }
    } catch (error) {
        console.error('Error updating record:', error);
        showToast('Error', 'Failed to update record: ' + error.message, 'error');
    }
}

/**
 * Open edit modal with record data
 */
function openEditModal(record) {
    currentEditId = record.id;
    
    // Populate form fields
    document.getElementById('editId').value = record.id;
    document.getElementById('editName').value = record.name || '';
    document.getElementById('editEmail').value = record.email || '';
    document.getElementById('editPhone').value = record.phone || '';
    
    // Show modal
    editModal.classList.add('show');
}

/**
 * Close edit modal
 */
function closeEditModal() {
    editModal.classList.remove('show');
    currentEditId = null;
    editForm.reset();
}

/**
 * Open delete confirmation modal
 */
function openDeleteModal(record) {
    const deleteRecordInfo = document.getElementById('deleteRecordInfo');
    deleteRecordInfo.textContent = `${record.name} (${record.email})`;
    
    // Store the record ID for deletion
    deleteRecordInfo.dataset.recordId = record.id;
    
    // Show modal
    deleteModal.classList.add('show');
}

/**
 * Close delete modal
 */
function closeDeleteModal() {
    deleteModal.classList.remove('show');
}

/**
 * Confirm and execute record deletion
 */
async function confirmDeleteRecord() {
    const recordId = document.getElementById('deleteRecordInfo').dataset.recordId;
    
    if (!recordId) {
        showToast('Error', 'No record selected for deletion', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}?id=${recordId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast('Success', 'Record deleted successfully', 'success');
            closeDeleteModal();
            loadRecords(); // Refresh the list
        } else {
            throw new Error(result.error || 'Failed to delete record');
        }
    } catch (error) {
        console.error('Error deleting record:', error);
        showToast('Error', 'Failed to delete record: ' + error.message, 'error');
    }
}

/**
 * Render records in the table
 */
function renderRecords() {
    if (records.length === 0) {
        recordsTableBody.innerHTML = '';
        emptyMessage.style.display = 'flex';
        return;
    }
    
    emptyMessage.style.display = 'none';
    
    const rows = records.map(record => `
        <tr>
            <td class="id-cell" title="${record.id}">${record.id}</td>
            <td>${escapeHtml(record.name || '')}</td>
            <td>${escapeHtml(record.email || '')}</td>
            <td>${escapeHtml(record.phone || '')}</td>
            <td class="date-cell">${formatDate(record.created_at)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-secondary" onclick="openEditModal(${JSON.stringify(record).replace(/"/g, '&quot;')})">
                        <i class="fas fa-edit"></i>
                        Edit
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="openDeleteModal(${JSON.stringify(record).replace(/"/g, '&quot;')})">
                        <i class="fas fa-trash"></i>
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    recordsTableBody.innerHTML = rows;
}

/**
 * Show/hide loading state
 */
function showLoading(show) {
    if (show) {
        loadingMessage.style.display = 'flex';
        emptyMessage.style.display = 'none';
    } else {
        loadingMessage.style.display = 'none';
    }
}

/**
 * Show toast notification
 */
function showToast(title, message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    toast.innerHTML = `
        <i class="fas fa-${getToastIcon(type)}"></i>
        <div class="toast-content">
            <div class="toast-title">${escapeHtml(title)}</div>
            <div class="toast-message">${escapeHtml(message)}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 5000);
}

/**
 * Get icon for toast type
 */
function getToastIcon(type) {
    switch (type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'info': return 'info-circle';
        default: return 'info-circle';
    }
}

/**
 * Format date for display
 */
function formatDate(dateString) {
    if (!dateString) return '';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    } catch (error) {
        return dateString;
    }
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Utility function to validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Utility function to validate phone format
 */
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

/**
 * Add form validation
 */
function validateForm(formData) {
    const errors = [];
    
    const name = formData.get('name')?.trim();
    const email = formData.get('email')?.trim();
    const phone = formData.get('phone')?.trim();
    
    if (!name) errors.push('Name is required');
    if (!email) errors.push('Email is required');
    if (email && !isValidEmail(email)) errors.push('Invalid email format');
    if (phone && !isValidPhone(phone)) errors.push('Invalid phone format');
    
    return errors;
}

/**
 * Handle form validation and show errors
 */
function handleFormValidation(formData) {
    const errors = validateForm(formData);
    
    if (errors.length > 0) {
        showToast('Validation Error', errors.join(', '), 'error');
        return false;
    }
    
    return true;
}

// Enhanced form submission with validation
addForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(addForm);
    
    if (!handleFormValidation(formData)) {
        return;
    }
    
    handleAddRecord(e);
});

editForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(editForm);
    
    if (!handleFormValidation(formData)) {
        return;
    }
    
    handleEditRecord(e);
});

/**
 * Auto-refresh data every 30 seconds
 */
setInterval(() => {
    loadRecords();
}, 30000);

/**
 * Handle keyboard shortcuts
 */
document.addEventListener('keydown', function(e) {
    // Escape key to close modals
    if (e.key === 'Escape') {
        if (editModal.classList.contains('show')) {
            closeEditModal();
        }
        if (deleteModal.classList.contains('show')) {
            closeDeleteModal();
        }
    }
    
    // Ctrl+R to refresh
    if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        loadRecords();
    }
});

/**
 * Add offline/online status indicator
 */
window.addEventListener('online', function() {
    showToast('Connection Restored', 'You are back online', 'success');
    loadRecords();
});

window.addEventListener('offline', function() {
    showToast('Connection Lost', 'You are offline. Some features may not work.', 'error');
});

/**
 * Add service worker for offline functionality (optional)
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
} 