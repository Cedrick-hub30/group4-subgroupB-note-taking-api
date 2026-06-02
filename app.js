require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.json());

// logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// shared in-memory data store
let notes = [
  { id: 1, title: 'First Note', content: 'This is my first note', createdAt: new Date() },
  { id: 2, title: 'Second Note', content: 'This is my second note', createdAt: new Date() },
];

// helper function to generate next id
const getNextId = () => notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1;

// ─── ROUTES ───────────────────────────────────────────

// get all notes 
app.get('/notes', (req, res) => {
  res.status(200).json(notes);
});

// get a single note by id
app.get('/notes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const note = notes.find(n => n.id === id);
  if (!note) return res.status(404).json({ error: 'Note not found' });
  res.status(200).json(note);
});

// Create a new note
app.post('/notes', (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'title and content are required' });
  }
  const newNote = {
    id: getNextId(),
    title,
    content,
    createdAt: new Date()
  };
  notes.push(newNote);
  res.status(201).json(newNote);
});

// Member 3 → PUT /notes/:id (update a note)

// Member 3 → DELETE /notes/:id (delete a note)

// Member 4 → GET /notes/search (search by title)

// Member 4 → global error handler

// ─── START SERVER ─────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));