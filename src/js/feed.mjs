// To handle loading and rendering feed

import { handleLike } from './likes.mjs';
import { loadPostDetails } from './post.mjs';

export function loadFeed(app, additionalPosts = null) {
    if (!additionalPosts) {
        if (app.feedElement) app.feedElement.innerHTML = "";
    }
    let postsToRender = additionalPosts || (app.showFollowedOnly ?
        app.posts.filter(p => app.followedUsers.has(p.userId)) : app.posts);

    postsToRender.forEach(post => {
        const card = renderPostCard(app, post);
        if (app.feedElement) app.feedElement.appendChild(card);
    });
}

export function renderPostCard(app, post, isDetail = false) {
    const user = app.users.find(u => u.id === post.userId);
    const card = document.createElement('div');
    card.className = 'post-card';
    card.dataset.postId = post.id;

    const isReposted = app.reposts.has(post.id);

    card.innerHTML = `
        <h3>${user ? user.name : 'User ' + post.userId}</h3>
        <p>${post.title}</p>
        ${isDetail ? `<p>${post.body}</p>` : ''}
        ${post.imageUrl ? `<img src="${post.imageUrl}" alt="post image">` : ''}
        ${post.geo ? `<span class="location-badge">📍 ${post.geo.lat}, ${post.geo.lng}</span>` : ''}

        <!-- Compact X-style action bar -->
        <div class="post-actions">
            <button class="action-btn comment-btn" data-post-id="${post.id}" title="Comment">💬</button>
            <button class="action-btn repost-btn ${isReposted ? 'reposted' : ''}" data-post-id="${post.id}" title="Repost">🔁</button>
            <button class="action-btn like-btn ${app.myLikes.has(post.id) ? 'liked' : ''}" data-post-id="${post.id}">❤️ <span class="like-count">${app.likes[post.id] || 0}</span></button>
            <button class="action-btn share-btn" data-post-id="${post.id}" title="Share">🔗</button>
            <button class="action-btn pin-btn" data-post-id="${post.id}" title="Pin">📌</button>
            <span class="views-count">${Math.floor(Math.random() * 12000) + 800} views</span>
        </div>
    `;

    // Like still works (delegated in app.mjs)
    card.querySelector('.like-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        handleLike(app, e);
    });

    if (!isDetail) {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('button')) {
                loadPostDetails(app, post.id);
            }
        });
    }

    return card;
}