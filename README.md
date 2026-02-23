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
