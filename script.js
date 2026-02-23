// Elements
const addNoteBtn = document.getElementById('addNote');
const exportNotesBtn = document.getElementById('exportNotes');
const noteText = document.getElementById('noteText');
const notesList = document.getElementById('notesList');
const dailyVerseEl = document.getElementById('dailyVerse');

// Daily verses array
const verses = [
  "Psalm 1:3 – He shall be like a tree planted by rivers of water...",
  "Jeremiah 17:7 – Blessed is the one who trusts in Yahuwah...",
  "Isaiah 40:31 – Those who wait on Yahuwah shall renew their strength...",
  "Matthew 5:16 – Let your light shine before men...",
  "Proverbs 3:5 – Trust in Yahuwah with all your heart..."
];

// Show a daily verse
function showDailyVerse() {
  const today = new Date();
  const index = today.getDate() % verses.length;
  dailyVerseEl.textContent = verses[index];
}

// Load saved notes
let notes = JSON.parse(localStorage.getItem('scriptureNotes')) || [];

// Display notes
function displayNotes() {
  notesList.innerHTML = '';
  notes.forEach(note => {
    const noteDiv = document.createElement('div');
    noteDiv.className = 'note';
    noteDiv.textContent = note;
    notesList.appendChild(noteDiv);
  });
}

// Add new note
addNoteBtn.addEventListener('click', () => {
  const text = noteText.value.trim();
  if (text) {
    notes.push(text);
    localStorage.setItem('scriptureNotes', JSON.stringify(notes));
    noteText.value = '';
    displayNotes();
  }
});

// Export notes
exportNotesBtn.addEventListener('click', () => {
  const blob = new Blob([notes.join("\n\n")], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ScriptureSproutsNotes.txt';
  a.click();
  URL.revokeObjectURL(url);
});

// Initialize
showDailyVerse();
displayNotes();
