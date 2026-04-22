// Handles navigation


import { loadFeed } from './feed.mjs'; // Added for home view
import { loadNearby } from './locationdiscovery.mjs'; // Added for nearby view
import { renderPostCard } from './feed.mjs'; // Added for profile posts
import { loadSettings } from './settings.mjs';
import { renderNotifications } from './notification.mjs';
import { loadMessages } from './messages.mjs';

export function initNavigation(app) {
    // Setup navigation handler that works for all nav elements
    const handleNavClick = (e) => {
        if (e.target.tagName === 'A' && e.target.dataset.view) {
            e.preventDefault();
            const view = e.target.dataset.view;
            app.showView(view);

            if (view === 'home') {
                loadFeed(app);
            }
            else if (view === 'nearby') {
                loadNearby(app);
            }
            else if (view === 'profile') {
                loadProfile(app, app.currentUserId);
            }
            else if (view === 'settings') {
                loadSettings(app);
            }
            else if (view === 'search') {
                // Focus on search input
                setTimeout(() => {
                    const searchInput = document.getElementById('search-input');
                    if (searchInput) searchInput.focus();
                }, 100);
            }
            else if (view === 'new-post') {
                // Focus on post textarea
                setTimeout(() => {
                    const postText = document.getElementById('post-text');
                    if (postText) postText.focus();
                }, 100);
            }
            else if (view === 'notifications') {
                renderNotifications(app);
            }
            else if (view === 'messages') {
                import('./messages.mjs').then(({ loadMessages }) => {
                    loadMessages(app);
                });
            }
        }
    };

    // Listen to all navigation elements
    const navList = document.getElementById('nav-list');
    const tabBar = document.getElementById('tab-bar');
    const quickLinks = document.getElementById('quick-links');

    if (navList) navList.addEventListener('click', handleNavClick);
    if (tabBar) tabBar.addEventListener('click', handleNavClick);
    if (quickLinks) quickLinks.addEventListener('click', handleNavClick);

    // Also store for backward compatibility
    app.navList = navList || quickLinks;
}

export function showSearchView(app) {
    const searchContainer = document.getElementById('search-container');
    if (searchContainer) {
        searchContainer.classList.remove('hidden');
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.focus();
    }
}

export function showNewPostView(app) {
    const newPostContainer = document.getElementById('new-post-container');
    if (newPostContainer) {
        newPostContainer.classList.remove('hidden');
        const postText = document.getElementById('post-text');
        if (postText) postText.focus();
    }
}

export function loadProfile(app, userId) {
    if (app.profileInfoElement) app.profileInfoElement.innerHTML = '';
    if (app.profilePostsElement) app.profilePostsElement.innerHTML = '';
    userId = userId || app.currentUserId;
    const user = app.users.find(u => u.id === userId);
    if (user && app.profileInfoElement) {
        app.profileInfoElement.innerHTML = `
            <h2>${user.name}</h2>
            <p>@${user.username}</p>
            <button class="follow-button" data-user-id="${userId}">${app.followedUsers.has(userId) ? 'Unfollow' : 'Follow'}</button>
        `;
        const userPosts = app.posts.filter(p => p.userId === userId);
        userPosts.forEach(p => {
            if (app.profilePostsElement) app.profilePostsElement.appendChild(renderPostCard(app, p));
        });
    }
}