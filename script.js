// script.js

// UUID generation function
function generateUUID() {
    return 'xxxx-xxxx-xxxx-xxxx'.replace(/[x]/g, function(c) {
        const r = Math.random() * 16 | 0;
        return r.toString(16);
    });
}

// Note management
let notes = [];

// Load notes from localStorage
function loadNotes() {
    const storedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    for (let note of storedNotes) {
        addNoteToDOM(note);
    }
}

// Add note to DOM
function addNoteToDOM(note) {
    const notesContainer = document.getElementById('notesContainer');
    const noteElement = document.createElement('div');
    noteElement.className = 'note';
    noteElement.id = note.id;
    noteElement.innerHTML = `<div>${note.content}</div>`;
    notesContainer.appendChild(noteElement);
}

// Save notes to localStorage
function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Add new note functionality
document.getElementById('addNoteButton').addEventListener('click', function() {
    const noteContent = document.getElementById('noteInput').value;
    const noteId = generateUUID();
    notes.push({ id: noteId, content: noteContent });
    addNoteToDOM({ id: noteId, content: noteContent });
    saveNotes();
    document.getElementById('noteInput').value = '';
});

// Edit note functionality
function editNote(noteId) {
    const noteElement = document.getElementById(noteId);
    const newContent = prompt('Edit your note:', noteElement.innerText);
    if (newContent) {
        noteElement.innerHTML = `<div>${newContent}</div>`;
        const noteIndex = notes.findIndex(note => note.id === noteId);
        notes[noteIndex].content = newContent;
        saveNotes();
    }
}

// Delete note functionality
function deleteNote(noteId) {
    const noteIndex = notes.findIndex(note => note.id === noteId);
    if (noteIndex > -1) {
        notes.splice(noteIndex, 1);
        document.getElementById(noteId).remove();
        saveNotes();
    }
}

// Clipboard feature
function copyToClipboard(noteId) {
    const noteElement = document.getElementById(noteId);
    navigator.clipboard.writeText(noteElement.innerText);
    alert('Note copied to clipboard!');
}

// Preferences system
let userPreferences = { theme: 'light' };
function setUserPreferences(preferences) {
    userPreferences = { ...userPreferences, ...preferences };
    applyPreferences();
}

function applyPreferences() {
    if (userPreferences.theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
}

// Notifications
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Character counting
const characterCounter = document.getElementById('characterCount');
const noteInput = document.getElementById('noteInput');
noteInput.addEventListener('input', function() {
    const count = noteInput.value.length;
    characterCounter.innerText = `${count} characters`;
});

// Error handling
try {
    loadNotes();
} catch (e) {
    console.error('Error loading notes:', e);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'Enter') {
        document.getElementById('addNoteButton').click();
    }
});

// HTML escaping
function escapeHTML(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
}

// Date formatting
function formatDate(date) {
    return date.toISOString().slice(0, 19).replace('T', ' ');
}

// Smooth scroll animations
function smoothScroll(target) {
    document.querySelector(target).scrollIntoView({ behavior: 'smooth' });
}

// Accessibility
function setAriaAccessibility() {
    const noteElements = document.querySelectorAll('.note');
    noteElements.forEach(note => {
        note.setAttribute('role', 'note');
        note.setAttribute('tabindex', '0');
    });
}

setAriaAccessibility();