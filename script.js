// ════════════════════════════════════════════════════════
// SCRIPTURE SPROUTS — ELITE EDITION
// Crafted with reverence, clarity, and restraint
// ════════════════════════════════════════════════════════

const $ = id => document.getElementById(id);

// DOM
const ui = {
  addBtn:     $('addNote'),
  exportBtn:  $('exportNotes'),
  noteInput:  $('noteText'),
  list:       $('notesList'),
  verse:      $('dailyVerse'),
  color:      $('textColor'),
  font:       $('fontSelect'),
  empty:      $('emptyState'),
  counter:    $('charCount')
};

// CONFIG
const CONFIG = {
  NOTES_KEY: 'scriptureNotes',
  PREF_KEY:  'scripturePreferences',
  LIMIT:     1000
};

// DATA
const VERSES = [
  "Psalm 1:3 — He shall be like a tree planted by rivers of water…",
  "Isaiah 40:31 — Those who wait on Yahuwah shall renew their strength.",
  "Proverbs 3:5 — Trust in Yahuwah with all your heart.",
  "Matthew 5:16 — Let your light shine before men.",
  "Psalm 119:105 — Your word is a lamp to my feet."
];

let state = {
  notes: [],
  prefs: { color: '#F5EFE0', font: 'EB Garamond' }
};

// ════════════════════════════════════════════════════════
// INIT
// ════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  hydrate();
  bind();
  render();
  verseOfTheDay();
});

// ════════════════════════════════════════════════════════
// HYDRATION
// ════════════════════════════════════════════════════════
function hydrate() {
  try {
    state.notes = JSON.parse(localStorage.getItem(CONFIG.NOTES_KEY)) || [];
    state.prefs = { ...state.prefs, ...JSON.parse(localStorage.getItem(CONFIG.PREF_KEY)) };
  } catch {}
}

function persist() {
  localStorage.setItem(CONFIG.NOTES_KEY, JSON.stringify(state.notes));
  localStorage.setItem(CONFIG.PREF_KEY, JSON.stringify(state.prefs));
}

// ════════════════════════════════════════════════════════
// EVENTS
// ════════════════════════════════════════════════════════
function bind() {
  ui.addBtn.onclick    = addNote;
  ui.exportBtn.onclick = exportNotes;
  ui.noteInput.oninput = updateCounter;
  ui.color.oninput     = e => applyColor(e.target.value);
  ui.font.onchange     = e => applyFont(e.target.value);

  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') addNote();
  });
}

// ════════════════════════════════════════════════════════
// CORE ACTIONS
// ════════════════════════════════════════════════════════
function addNote() {
  const text = ui.noteInput.value.trim();
  if (!text) return notify('Write before adding', 'warning');

  state.notes.unshift({
    id: crypto.randomUUID(),
    text,
    time: new Date().toISOString()
  });

  ui.noteInput.value = '';
  updateCounter();
  persist();
  render();
  notify('Reflection saved', 'success');
}

function render() {
  ui.list.innerHTML = '';
  ui.empty.style.display = state.notes.length ? 'none' : 'block';

  state.notes.forEach((n, i) => {
    const el = document.createElement('article');
    el.className = 'note';
    el.innerHTML = `
      <div class="note-header">
        <span class="note-number">✦ ${String(state.notes.length - i).padStart(2, '0')}</span>
        <span class="note-date">${new Date(n.time).toLocaleString()}</span>
      </div>
      <div class="note-content">${escape(n.text)}</div>
    `;
    ui.list.appendChild(el);
  });
}

// ════════════════════════════════════════════════════════
// UTILITIES
// ════════════════════════════════════════════════════════
function verseOfTheDay() {
  const day = Math.floor(Date.now() / 86400000);
  ui.verse.textContent = VERSES[day % VERSES.length];
}

function updateCounter() {
  ui.counter.textContent = ui.noteInput.value.length;
}

function applyColor(val) {
  document.body.style.color = val;
  state.prefs.color = val;
  persist();
}

function applyFont(val) {
  document.body.style.fontFamily = `'${val}', serif`;
  state.prefs.font = val;
  persist();
}

function exportNotes() {
  if (!state.notes.length) return notify('Nothing to export', 'info');

  const body = state.notes
    .map((n, i) => `#${i + 1}\n${n.text}\n`)
    .join('\n—\n');

  download(body);
  notify('Export complete', 'success');
}

function download(text) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
  a.download = 'ScriptureSprouts.txt';
  a.click();
}

function notify(msg, type) {
  const n = document.createElement('div');
  n.className = `notification notification-${type}`;
  n.textContent = msg;
  document.body.appendChild(n);
  requestAnimationFrame(() => n.classList.add('show'));
  setTimeout(() => n.remove(), 3200);
}

const escape = s => s.replace(/[&<>"']/g, m =>
  ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m])
);
