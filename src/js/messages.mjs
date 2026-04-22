
import { getFromStorage, setToStorage } from "./localstorage.mjs";

export function loadMessages(app) {
  app.showView('messages');
  renderChatsList(app);
}

function renderChatsList(app) {
  const container = document.getElementById('chats-list');
  container.innerHTML = `<h2>Messages</h2><p class="chats-subtitle">Friends you follow</p>`;

  const friends = app.users.filter(u => app.followedUsers.has(u.id));

  if (friends.length === 0) {
    container.innerHTML += `<p style="padding: 2rem; text-align:center; opacity:0.6;">You haven't followed anyone yet.<br>Go to a profile and follow someone!</p>`;
    return;
  }

  friends.forEach(user => {
    const chatKey = getChatKey(app.currentUserId, user.id);
    const messages = app.chats[chatKey] || [];
    const lastMsg = messages.length ? messages[messages.length - 1].text : "Say hi 👋";

    const div = document.createElement('div');
    div.className = 'chat-item';
    div.innerHTML = `
      <div class="chat-avatar">👤</div>
      <div class="chat-info">
        <strong>${user.name}</strong>
        <small>@${user.username}</small>
        <p class="last-message">${lastMsg}</p>
      </div>
    `;
    div.addEventListener('click', () => openChat(app, user));
    container.appendChild(div);
  });
}

function getChatKey(userA, userB) {
  return userA < userB ? `${userA}-${userB}` : `${userB}-${userA}`;
}

function openChat(app, otherUser) {
  const chatWindow = document.getElementById('chat-window');
  const header = document.getElementById('chat-header');
  const messagesArea = document.getElementById('chat-messages');

  chatWindow.classList.remove('hidden');
  document.getElementById('chats-list').classList.add('hidden');

  header.innerHTML = `
    <button id="back-to-chats">←</button>
    <div style="display:flex; align-items:center; gap:10px;">
      <span style="font-size:1.5rem;">👤</span>
      <div>
        <strong>${otherUser.name}</strong><br>
        <small>@${otherUser.username}</small>
      </div>
    </div>
  `;

  const chatKey = getChatKey(app.currentUserId, otherUser.id);
  app.currentChatKey = chatKey;
  app.currentChatUser = otherUser;

  renderChatMessages(app, messagesArea);

  // Back button
  header.querySelector('#back-to-chats').addEventListener('click', () => {
    chatWindow.classList.add('hidden');
    document.getElementById('chats-list').classList.remove('hidden');
    renderChatsList(app);
  });

  // Send button
  const sendBtn = document.getElementById('send-message-btn');
  const input = document.getElementById('chat-input');

  sendBtn.onclick = () => {
    const text = input.value.trim();
    if (!text) return;

    if (!app.chats[chatKey]) app.chats[chatKey] = [];
    app.chats[chatKey].push({
      from: app.currentUserId,
      text: text,
      time: Date.now()
    });

    setToStorage('chats', app.chats);
    input.value = '';
    renderChatMessages(app, messagesArea);
  };

  // Allow pressing Enter
  input.onkeydown = e => { if (e.key === 'Enter') sendBtn.click(); };
}

function renderChatMessages(app, container) {
  container.innerHTML = '';
  const messages = app.chats[app.currentChatKey] || [];

  messages.forEach(msg => {
    const isMine = msg.from === app.currentUserId;
    const bubble = document.createElement('div');
    bubble.className = `message-bubble ${isMine ? 'mine' : 'theirs'}`;
    bubble.textContent = msg.text;
    container.appendChild(bubble);
  });

  container.scrollTop = container.scrollHeight;
}