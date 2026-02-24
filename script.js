/**
 * Scripture Sprouts - Premium Scripture Application
 * Version: 2.0 Elite
 * A luxurious, polished application for daily scripture contemplation
 */

// ==================== DOM ELEMENTS ====================
const addNoteBtn = document.getElementById('addNote');
const exportNotesBtn = document.getElementById('exportNotes');
const noteText = document.getElementById('noteText');
const notesList = document.getElementById('notesList');
const dailyVerseEl = document.getElementById('dailyVerse');
const textColorInput = document.getElementById('textColor');
const fontSelect = document.getElementById('fontSelect');
const emptyState = document.getElementById('emptyState');
const charCount = document.getElementById('charCount');

// ==================== CONFIGURATION ====================
const CONFIG = {
  storageKey: 'scriptureNotes',
  userPreferencesKey: 'scripturePreferences',
  maxCharacters: 1000,
  animationDuration: 500,
  debounceDelay: 300
};

const verses = [
  "Psalm 1:3 – He shall be like a tree planted by rivers of water, That brings forth its fruit in its season, Whose leaf also shall not wither; And whatever he does shall prosper.",
  "Jeremiah 17:7 – Blessed is the man who trusts in the LORD, And whose hope is the LORD.",
  "Isaiah 40:31 – But those who wait on the LORD Shall renew their strength; They shall mount up with wings like eagles, They shall run and not be weary, They shall walk and not faint.",
  "Matthew 5:16 – Let your light so shine before men, That they may see your good works And glorify your Father in heaven.",
  "Proverbs 3:5 – Trust in the LORD with all your heart, And lean not on your own understanding."
];

// ==================== STATE MANAGEMENT ====================
let notes = [];
let preferences = {
  textColor: '#FAF8F0',
  font: 'Inter'
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

function initializeApp() {
  loadNotes();
  loadPreferences();
  applyPreferences();
  displayNotes();
  showDailyVerse();
  attachEventListeners();
  updateEmptyState();
}

// ==================== EVENT LISTENERS ====================
function attachEventListeners() {
  addNoteBtn.addEventListener('click', handleAddNote);
  exportNotesBtn.addEventListener('click', handleExportNotes);
  textColorInput.addEventListener('input', handleColorChange);
  fontSelect.addEventListener('change', handleFontChange);
  noteText.addEventListener('input', handleCharacterCount);
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && noteText === document.activeElement) {
      handleAddNote();
    }
  });
}

// ==================== NOTE MANAGEMENT ====================
function handleAddNote() {
  const text = noteText.value.trim();
  
  if (!text) {
    showNotification('Please enter a note', 'warning');
    noteText.focus();
    return;
  }
  
  if (text.length > CONFIG.maxCharacters) {
    showNotification('Note exceeds maximum length', 'error');
    return;
  }

  const note = {
    id: generateUUID(),
    content: text,
    timestamp: new Date().toISOString(),
    edited: false
  };

  notes.unshift(note);
  saveNotes();
  noteText.value = '';
  charCount.textContent = '0';
  displayNotes();
  updateEmptyState();
  showNotification('✨ Note added successfully', 'success');
  
  // Smooth scroll to top
  scrollToNotesList();
}

function displayNotes() {
  notesList.innerHTML = '';
  
  if (notes.length === 0) {
    updateEmptyState();
    return;
  }
  
  updateEmptyState();
  
  notes.forEach((note, index) => {
    const noteElement = createNoteElement(note, index);
    notesList.appendChild(noteElement);
    
    // Trigger animation
    setTimeout(() => {
      noteElement.classList.add('animate');
    }, index * 50);
  });
}

function createNoteElement(note, index) {
  const noteDiv = document.createElement('div');
  noteDiv.className = 'note';
  noteDiv.setAttribute('data-id', note.id);
  noteDiv.setAttribute('role', 'article');
  noteDiv.setAttribute('aria-label', `Scripture note ${index + 1}`);

  const timestamp = new Date(note.timestamp);
  const formattedDate = formatDate(timestamp);

  noteDiv.innerHTML = `
    <div class="note-header">
      <span class="note-number">#${notes.length - index}</span>
      <span class="note-date">${formattedDate}</span>
      ${note.edited ? '<span class="note-edited" title="This note has been edited">✏️</span>' : ''}
    </div>
    <div class="note-content">${escapeHtml(note.content)}</div>
    <div class="note-actions">
      <button class="note-btn note-edit" aria-label="Edit note">✏️ Edit</button>
      <button class="note-btn note-delete" aria-label="Delete note">🗑️ Delete</button>
      <button class="note-btn note-copy" aria-label="Copy note">📋 Copy</button>
    </div>
  `;

  // Event listeners for note actions
  noteDiv.querySelector('.note-delete').addEventListener('click', () => deleteNote(note.id));
  noteDiv.querySelector('.note-copy').addEventListener('click', () => copyToClipboard(note.content));
  noteDiv.querySelector('.note-edit').addEventListener('click', () => editNote(note.id, note.content));

  return noteDiv;
}

function deleteNote(id) {
  const index = notes.findIndex(note => note.id === id);
  if (index > -1) {
    const noteElement = document.querySelector(`[data-id="${id}"]`);
    
    // Smooth remove animation
    noteElement.classList.add('removing');
    setTimeout(() => {
      notes.splice(index, 1);
      saveNotes();
      displayNotes();
      updateEmptyState();
      showNotification('Note deleted', 'info');
    }, 300);
  }
}

function editNote(id, content) {
  const newContent = prompt('Edit your note:', content);
  if (newContent !== null && newContent.trim()) {
    const note = notes.find(n => n.id === id);
    if (note) {
      note.content = newContent.trim();
      note.edited = true;
      note.timestamp = new Date().toISOString();
      saveNotes();
      displayNotes();
      showNotification('Note updated', 'success');
    }
  }
}

// ==================== VERSE MANAGEMENT ====================
function showDailyVerse() {
  const today = new Date();
  const index = today.getDate() % verses.length;
  const verse = verses[index];
  
  dailyVerseEl.textContent = verse;
  dailyVerseEl.classList.add('verse-loaded');
  
  // Store verse preference
  localStorage.setItem('lastVerse', verse);
}

// ==================== EXPORT FUNCTIONALITY ====================
function handleExportNotes() {
  if (notes.length === 0) {
    showNotification('No notes to export', 'warning');
    return;
  }

  const content = generateExportContent();
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = `ScriptureSprouts-Notes-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  showNotification('✅ Notes exported successfully', 'success');
}

function generateExportContent() {
  let content = 'SCRIPTURE SPROUTS - PERSONAL NOTES\n';
  content += '===================================\n\n';
  content += `Exported: ${new Date().toLocaleString()}\n\n`;

  notes.forEach((note, index) => {
    content += `Note #${notes.length - index}\n`;
    content += `Date: ${new Date(note.timestamp).toLocaleString()}\n`;
    content += `${note.edited ? 'Status: Edited\n' : ''}`;
    content += `\n${note.content}\n\n`;
    content += '---\n\n';
  });

  return content;
}

// ==================== CUSTOMIZATION ====================
function handleColorChange(e) {
  const color = e.target.value;
  document.body.style.color = color;
  preferences.textColor = color;
  savePreferences();
}

function handleFontChange(e) {
  const font = e.target.value;
  const fontFamily = font === 'Inter' ? "'Inter', sans-serif" : "'Great Vibes', cursive";
  document.body.style.fontFamily = fontFamily;
  preferences.font = font;
  savePreferences();
}

function handleCharacterCount(e) {
  const count = e.target.value.length;
  charCount.textContent = count;
  
  // Visual feedback for character limit
  if (count > CONFIG.maxCharacters * 0.9) {
    charCount.style.color = '#FFB700';
  } else if (count > CONFIG.maxCharacters) {
    charCount.style.color = '#FF6B6B';
  } else {
    charCount.style.color = '#FFD700';
  }
}

// ==================== STORAGE MANAGEMENT ====================
function loadNotes() {
  try {
    const stored = localStorage.getItem(CONFIG.storageKey);
    notes = stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading notes:', error);
    notes = [];
  }
}

function saveNotes() {
  try {
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(notes));
  } catch (error) {
    console.error('Error saving notes:', error);
    showNotification('Failed to save notes', 'error');
  }
}

function loadPreferences() {
  try {
    const stored = localStorage.getItem(CONFIG.userPreferencesKey);
    if (stored) {
      preferences = { ...preferences, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Error loading preferences:', error);
  }
}

function savePreferences() {
  try {
    localStorage.setItem(CONFIG.userPreferencesKey, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving preferences:', error);
  }
}

function applyPreferences() {
  textColorInput.value = preferences.textColor;
  document.body.style.color = preferences.textColor;
  
  fontSelect.value = preferences.font;
  const fontFamily = preferences.font === 'Inter' ? "'Inter', sans-serif" : "'Great Vibes', cursive";
  document.body.style.fontFamily = fontFamily;
}

// ==================== UTILITY FUNCTIONS ====================
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showNotification('📋 Note copied to clipboard', 'success');
  }).catch(() => {
    showNotification('Failed to copy note', 'error');
  });
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function formatDate(date) {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleDateString('en-US', options);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function updateEmptyState() {
  emptyState.style.display = notes.length === 0 ? 'block' : 'none';
}

function scrollToNotesList() {
  const element = document.querySelector('.notes-list');
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.setAttribute('role', 'alert');
  notification.setAttribute('aria-live', 'assertive');
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Trigger animation
  setTimeout(() => notification.classList.add('show'), 10);
  
  // Remove after delay
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}
