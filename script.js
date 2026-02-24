// ══════════════════════════════════════════════════════════
// DOM ELEMENTS
// ══════════════════════════════════════════════════════════
const addNoteBtn     = document.getElementById('addNote');
const exportNotesBtn = document.getElementById('exportNotes');
const noteText       = document.getElementById('noteText');
const notesList      = document.getElementById('notesList');
const dailyVerseEl   = document.getElementById('dailyVerse');
const textColorInput = document.getElementById('textColor');
const fontSelect     = document.getElementById('fontSelect');
const emptyState     = document.getElementById('emptyState');
const charCountEl    = document.getElementById('charCount');

// ══════════════════════════════════════════════════════════
// CONFIGURATION
// ══════════════════════════════════════════════════════════
const CONFIG = {
  storageKey:     'scriptureNotes',
  preferencesKey: 'scripturePreferences',
  maxCharacters:  1000,
};

const verses = [
  "Psalm 1:3 — He shall be like a tree planted by rivers of water, That brings forth its fruit in its season, Whose leaf also shall not wither; And whatever he does shall prosper.",
  "Jeremiah 17:7 — Blessed is the man who trusts in the LORD, And whose hope is the LORD.",
  "Isaiah 40:31 — But those who wait on the LORD Shall renew their strength; They shall mount up with wings like eagles, They shall run and not be weary, They shall walk and not faint.",
  "Matthew 5:16 — Let your light so shine before men, That they may see your good works And glorify your Father in heaven.",
  "Proverbs 3:5 — Trust in the LORD with all your heart, And lean not on your own understanding.",
  "Philippians 4:7 — And the peace of God, which surpasses all understanding, will guard your hearts and minds through Christ Jesus.",
  "Psalms 119:105 — Your word is a lamp to my feet and a light to my path.",
];

// ══════════════════════════════════════════════════════════
// STATE
// ══════════════════════════════════════════════════════════
let notes = [];
let preferences = { textColor: '#F5EFE0', font: 'EB Garamond' };

// ══════════════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  loadNotes();
  loadPreferences();
  applyPreferences();
  displayNotes()
