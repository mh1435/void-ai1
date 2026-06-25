// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  
  // --- UI Elements ---
  const settingsBtn = document.getElementById('btn-settings');
  const closeSettingsBtn = document.getElementById('btn-close-settings');
  const settingsModal = document.getElementById('settings-modal');
  
  const chatInput = document.getElementById('prompt-input');
  const executeBtn = document.getElementById('btn-execute');
  const chatHistory = document.getElementById('chat-history');
  
  const purgeBtn = document.getElementById('btn-purge');
  const logContainer = document.getElementById('log-container');
  const sysClock = document.getElementById('sys-clock');

  // --- Clock Updater ---
  setInterval(() => {
    const now = new Date();
    sysClock.textContent = now.toLocaleTimeString('en-US', { hour12: false });
  }, 1000);

  // --- Modal Logic (The Gear Icon) ---
  settingsBtn.addEventListener('click', () => {
    settingsModal.classList.add('active');
    appendLog('Configuration settings panel opened by user.');
  });

  closeSettingsBtn.addEventListener('click', () => {
    settingsModal.classList.remove('active');
  });

  // Close modal if clicking outside the window
  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
      settingsModal.classList.remove('active');
    }
  });

  // --- Textarea Auto-Resize & Submit ---
  chatInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
  });

  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      executePrompt();
    }
  });

  executeBtn.addEventListener('click', executePrompt);

  function executePrompt() {
    const text = chatInput.value.trim();
    if (!text) return;

    // Add User Message
    const userMsg = `
      <div class="message user">
        <div class="msg-meta">USER::NODE // ${new Date().toLocaleTimeString('en-US', {hour12: false})}</div>
        <div class="msg-body">${escapeHTML(text)}</div>
      </div>
    `;
    chatHistory.insertAdjacentHTML('beforeend', userMsg);
    
    // Reset Input
    chatInput.value = '';
    chatInput.style.height = 'auto';
    scrollToBottom(chatHistory);
    
    appendLog(`Dispatched query payload [${text.length} bytes] to matrix.`);

    // Mock System Response (Replace with your actual fetch API call)
    setTimeout(() => {
      const sysMsg = `
        <div class="message system">
          <div class="msg-meta">VOID::CORE // ${new Date().toLocaleTimeString('en-US', {hour12: false})}</div>
          <div class="msg-body">Awaiting backend connection. Data stream parsed successfully.</div>
        </div>
      `;
      chatHistory.insertAdjacentHTML('beforeend', sysMsg);
      scrollToBottom(chatHistory);
      appendLog('Received execution matrix response.');
    }, 800);
  }

  // --- System Event Stream Logic ---
  function appendLog(message) {
    const timestamp = new Date().toLocaleTimeString('en-US', {hour12: false});
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry new';
    logEntry.textContent = `[${timestamp}] -- ${message}`;
    
    logContainer.appendChild(logEntry);
    scrollToBottom(logContainer);

    // Remove highlight class after a moment
    setTimeout(() => {
      logEntry.classList.remove('new');
    }, 2000);
  }

  purgeBtn.addEventListener('click', () => {
    logContainer.innerHTML = '';
    appendLog('SYSTEM BUFFER PURGED MANUALLY.');
  });

  // --- Utility Functions ---
  function scrollToBottom(element) {
    element.scrollTop = element.scrollHeight;
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          "'": '&#39;',
          '"': '&quot;'
        }[tag] || tag)
    );
  }
});
