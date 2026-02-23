<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Scripture Sprouts 🌱</title>
  <link rel="icon" type="image/png" href="favicon.png">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <img id="logo" src="logo-placeholder.png" alt="Scripture Sprouts Logo">
    <h1 class="title">Scripture Sprouts 🌱</h1>
    <p class="subtitle">Mom, may Yahuwah’s Word bloom in your heart every day ❤️‍🔥</p>
    <div class="daily-verse" id="dailyVerse"></div>
  </header>
  <main>
    <section class="note-input">
      <textarea id="noteText" placeholder="Write a Scripture note..."></textarea>
      <div class="buttons">
        <button id="addNote">Add Note 🌿</button>
        <button id="exportNotes">Export Notes 💾</button>
      </div>
    </section>
    <section class="notes-list" id="notesList"></section>
  </main>
  <script src="script.js"></script>
</body>
</html>
/* Reset */
* { box-sizing: border-box; margin:0; padding:0; }

/* Body & background */
body {
  font-family: 'Helvetica Neue', sans-serif;
  background: linear-gradient(to top, #FFFAE5, #D0FFF7);
  color: #2e2e2e;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  overflow-x: hidden;
}

/* Header */
header {
  text-align: center;
  margin-bottom: 30px;
  position: relative;
}

.title {
  font-family: 'Great Vibes', cursive;
  font-size: 3rem;
  color: #3a7d44;
  animation: fadeIn 2s ease-in;
}

.subtitle {
  font-family: 'Helvetica Neue', sans-serif;
  font-size: 1.2rem;
  color: #555;
  animation: fadeIn 2s ease-in 0.5s;
}

.daily-verse {
  margin-top: 15px;
  font-style: italic;
  color: #2e5d34;
  animation: fadeIn 2s ease-in 1s;
}

/* Note input */
.note-input {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
  margin-bottom: 30px;
  position: relative;
}

textarea {
  resize: none;
  padding: 15px;
  font-size: 1rem;
  border-radius: 10px;
  border: 1px solid #ccc;
  min-height: 100px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.buttons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

button {
  padding: 10px;
  font-size: 1rem;
  border: none;
  border-radius: 10px;
  background-color: #3a7d44;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover {
  background-color: #2e5d34;
  transform: scale(1.05);
}

/* Notes list */
.notes-list {
  width: 100%;
  max-width: 500px;
  position: relative;
}

.note {
  background: #f3f9f1;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 10px;
  animation: fadeInUp 0.5s ease;
  position: relative;
  overflow: hidden;
}

/* Gentle floating leaves 🌱 effect */
.note::before {
  content: "🌱";
  position: absolute;
  top: -20px;
  left: -10px;
  font-size: 1.2rem;
  animation: floatLeaf 4s infinite ease-in-out;
  opacity: 0.7;
}

/* Subtle sparkle effect ✨ */
.note::after {
  content: "✨";
  position: absolute;
  top: 0;
  right: 0;
  font-size: 1rem;
  animation: sparkle 2s infinite;
  opacity: 0.6;
}

/* Logo animation */
#logo {
  width: 200px;
  max-width: 80%;
  margin-bottom: 15px;
  animation: floatLogo 4s infinite ease-in-out, glow 3s infinite alternate;
}

/* Animations */
@keyframes fadeIn { from { opacity:0; transform: translateY(-20px);} to {opacity:1; transform: translateY(0);} }
@keyframes fadeInUp { from { opacity:0; transform: translateY(20px);} to { opacity:1; transform: translateY(0);} }
@keyframes floatLeaf { 0% { transform: translateY(0) rotate(0deg);} 50% { transform: translateY(-5px) rotate(10deg);} 100% { transform: translateY(0) rotate(0deg);} }
@keyframes sparkle { 0%,100% { opacity: 0.3; } 50% { opacity: 1; } }
@keyframes floatLogo { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-5px);} }
@keyframes glow { 0% { filter: drop-shadow(0 0 3px #fff);} 50% { filter: drop-shadow(0 0 8px #FFD700);} 100% { filter: drop-shadow(0 0 3px #fff);} }
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
