/**
 * VOID CORE FRONT-END APPLICATION CONTROLLER
 * Isolated pipeline router - Decoupled from static game logs
 */

document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-item-link');
  const panelTitle = document.getElementById('current-panel-title');
  const queryInput = document.getElementById('terminal-query-input');
  const submitBtn = document.getElementById('submit-query-btn');
  const dynamicRoot = document.getElementById('dynamic-view-root');
  const coreStatusCard = document.getElementById('core-status-card');

  // 1. NAVIGATION ROUTING SYSTEM
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Update active navigation visual state
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      const targetView = link.getAttribute('data-target');
      executeViewSwitch(targetView);
    });
  });

  function executeViewSwitch(viewId) {
    // Standardize title updates based on requested pipeline node
    if (viewId === 'terminal') {
      panelTitle.textContent = 'RUNTIME TERMINAL';
      coreStatusCard.style.display = 'block';
      dynamicRoot.classList.add('view-hidden');
    } else if (viewId === 'gamehub') {
      panelTitle.textContent = 'GAME HUB';
      coreStatusCard.style.display = 'block'; // Keeps original look matching 1000171378.jpg
      dynamicRoot.classList.remove('view-hidden');
      // Trigger hooks for external data managers here if needed
    } else if (viewId === 'core') {
      panelTitle.textContent = 'CORE OPTIONS';
      coreStatusCard.style.display = 'none';
      dynamicRoot.classList.remove('view-hidden');
      dynamicRoot.innerHTML = `<div class="system-alert">// CORE SETTINGS MATRIX ONLINE</div>`;
    }
  }

  // 2. INPUT PROCESSING ENGINE
  function handleQuerySubmission() {
    const query = queryInput.value.trim();
    if (!query) return;

    console.log(`[VOID ENGINE] Dispatched query upstream: ${query}`);
    
    // Clear prompt state following dispatch
    queryInput.value = '';
    
    // Optional: Dispatch standard custom event so separate scripts can intercept queries
    const queryEvent = new CustomEvent('voidQueryDispatched', { detail: { command: query } });
    document.dispatchEvent(queryEvent);
  }

  submitBtn.addEventListener('click', handleQuerySubmission);
  queryInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleQuerySubmission();
  });
});
