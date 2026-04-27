// Handles notifications

import { setToStorage } from './localstorage.mjs';

export function addNotification(app, message) {
    app.notifications.push({ message, read: false, timestamp: Date.now() });
    setToStorage('notifications', app.notifications);
    updateNotificationCount(app);
}

export function updateNotificationCount(app) {
    const unread = app.notifications.filter(n => !n.read).length;
    if (app.notifCountElement) app.notifCountElement.textContent = unread;
}

export function renderNotifications(app) {
    const dropdown = document.getElementById('notifications-dropdown');
    if (!dropdown) return;
    
    // Toggle the dropdown visibility
    const isVisible = dropdown.classList.contains('show');
    if (isVisible) {
        dropdown.classList.remove('show');
        dropdown.classList.add('hidden');
        return;
    }
    
    // Clear previous content
    dropdown.innerHTML = '';
    
    // Add buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.marginBottom = 'var(--spacing-md)';
    
    const clearButton = document.createElement('button');
    clearButton.textContent = 'Clear All';
    clearButton.addEventListener('click', () => clearNotifications(app));
    
    const markReadButton = document.createElement('button');
    markReadButton.textContent = 'Mark All as Read';
    markReadButton.addEventListener('click', () => markAllAsRead(app));
    
    buttonContainer.appendChild(markReadButton);
    buttonContainer.appendChild(clearButton);
    dropdown.appendChild(buttonContainer);
    
    // Add notifications
    app.notifications.sort((a, b) => b.timestamp - a.timestamp).forEach(n => {
        const item = document.createElement('div');
        item.textContent = n.message;
        if (!n.read) item.classList.add('unread');
        dropdown.appendChild(item);
    });
    
    // Show dropdown - remove hidden and add show
    dropdown.classList.remove('hidden');
    dropdown.classList.add('show');
    dropdown.style.display = 'block';
    
    // Hide on click outside
    document.addEventListener('click', hideNotificationsBound, { once: true });
}

function hideNotificationsBound(e) {
    const dropdown = document.getElementById('notifications-dropdown');
    const bell = document.getElementById('notifications-bell');
    if (dropdown && bell && !dropdown.contains(e.target) && !bell.contains(e.target)) {
        dropdown.classList.remove('show');
    }
}

function markAllAsRead(app) {
    app.notifications.forEach(n => n.read = true);
    setToStorage('notifications', app.notifications);
    updateNotificationCount(app);
    renderNotifications(app);
}

function clearNotifications(app) {
    app.notifications = [];
    setToStorage('notifications', app.notifications);
    updateNotificationCount(app);
    const dropdown = document.getElementById('notifications-dropdown');
    if (dropdown) {
        dropdown.innerHTML = '<p>No notifications</p>';
        dropdown.classList.remove('show');
    }
}