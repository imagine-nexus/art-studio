/* ═══════════════════════════════════════════════════════════════
   APP INITIALIZATION (Fetching app.json)
═══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  fetch('app.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(apps => {
      const grid = document.getElementById('dynamicAppGrid');
      grid.innerHTML = ''; // Clear container

      apps.forEach(app => {
        // Smart check: If the logo is a URL, render an image. If it's an emoji, render text.
        const isUrl = app.logo.startsWith('http') || app.logo.includes('/');
        const logoHtml = isUrl 
          ? `<img src="${app.logo}" alt="${app.name} logo" style="width: 28px; height: 28px; object-fit: contain; border-radius: 4px;">` 
          : app.logo;

        grid.innerHTML += `
          <div class="app-card">
            <div class="app-header">
              <div class="app-icon" style="color: ${app.color};">${logoHtml}</div>
              <div>
                <h3>${app.name}</h3>
                <span class="version-tag">${app.version}</span>
              </div>
            </div>
            <p>${app.details}</p>
            <a href="${app.link}" target="_blank" class="btn btn-primary app-launch-btn">Launch App</a>
          </div>
        `;
      });
    })
    .catch(error => {
      console.error('Error fetching apps:', error);
      document.getElementById('dynamicAppGrid').innerHTML = '<p class="text-muted" style="grid-column: 1 / -1;">Error loading applications. Make sure you are running a local web server (CORS policy blocks local file fetching).</p>';
    });
});

/* ═══════════════════════════════════════════════════════════════
   TOAST SYSTEM (Settings Feedback)
═══════════════════════════════════════════════════════════════ */
function showToast(msg) {
  const tc = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<span style="color:var(--cyan);">✓</span> ${msg}`;
  tc.appendChild(t);
  setTimeout(() => t.remove(), 2800);
}

/* ═══════════════════════════════════════════════════════════════
   NAVIGATION LOGIC
═══════════════════════════════════════════════════════════════ */
const navItems = document.querySelectorAll('.nav-item[data-target]');
const views = document.querySelectorAll('.view-section');
const pageTitle = document.getElementById('pageTitle');

const titles = {
  'apps': 'Your Workspace',
  'files': 'Local Files',
  'assets': 'Assets & Fonts',
  'tutorials': 'Tutorials',
  'settings': 'Settings'
};

navItems.forEach(item => {
  item.addEventListener('click', () => {
    navItems.forEach(n => n.classList.remove('active'));
    views.forEach(v => v.classList.remove('active-view'));

    item.classList.add('active');
    const targetId = item.getAttribute('data-target');
    document.getElementById('view-' + targetId).classList.add('active-view');
    pageTitle.textContent = titles[targetId];
  });
});

/* ═══════════════════════════════════════════════════════════════
   SETTINGS LOGIC & THEME SWITCHER
═══════════════════════════════════════════════════════════════ */
document.querySelectorAll('.switch input').forEach(toggle => {
  toggle.addEventListener('change', () => {
    showToast("Preference saved.");
  });
});

document.getElementById('themeSelect').addEventListener('change', (e) => {
  if(e.target.value === 'light') {
    document.body.classList.add('theme-light');
    showToast("Studio Light theme activated.");
  } else {
    document.body.classList.remove('theme-light');
    showToast("Dark Obsidian theme activated.");
  }
});

const undoSlider = document.getElementById('undoSlider');
const undoVal = document.getElementById('undoVal');
undoSlider.addEventListener('input', (e) => {
  undoVal.textContent = e.target.value;
});
undoSlider.addEventListener('change', () => {
  showToast(`History set to ${undoSlider.value} steps.`);
});

/* ═══════════════════════════════════════════════════════════════
   LOCAL FILE PICKER LOGIC (Native Browser API)
═══════════════════════════════════════════════════════════════ */
const browseBtn = document.getElementById('browseFilesBtn');
const filePicker = document.getElementById('nativeFilePicker');
const fileListContainer = document.getElementById('fileListContainer');
const fileCountTitle = document.getElementById('fileCountTitle');

browseBtn.addEventListener('click', () => filePicker.click());

filePicker.addEventListener('change', (e) => {
  const files = Array.from(e.target.files);
  if (files.length === 0) return;
  
  fileListContainer.innerHTML = ''; 
  fileCountTitle.textContent = `Recent Files (${files.length})`;

  files.forEach(file => {
    let icon = file.type.startsWith('image/') ? '🖼️' : '📄';
    if (file.name.endsWith('.json')) icon = '⚙️';

    let sizeStr = file.size > 1048576 
      ? (file.size / 1048576).toFixed(1) + ' MB' 
      : (file.size / 1024).toFixed(1) + ' KB';

    const fileEl = document.createElement('div');
    fileEl.className = 'file-item';
    fileEl.innerHTML = `
      <div class="file-icon">${icon}</div>
      <div style="overflow:hidden;">
        <div class="file-name" title="${file.name}">${file.name}</div>
        <div class="file-size" style="font-size:11px; color:var(--text-dim);">${sizeStr}</div>
      </div>
    `;
    fileListContainer.appendChild(fileEl);
  });
});

/* ═══════════════════════════════════════════════════════════════
   REAL REDIRECT ON SIGN OUT
═══════════════════════════════════════════════════════════════ */
document.getElementById('signOutBtn').addEventListener('click', () => {
  if (confirm("Are you sure you want to sign out?")) {
    window.location.href = 'login.html'; 
  }
});
