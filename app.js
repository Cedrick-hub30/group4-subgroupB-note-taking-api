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

// ─── ROUTES ────────

// get all notes
app.get('/notes', (req, res) => {
  res.status(200).json(notes);
});

// search notes by title
app.get('/notes/search', (req, res) => {
  const { title } = req.query;
  if (!title) {
    return res.status(400).json({ error: 'title query parameter is required' });
  }
  const results = notes.filter(n =>
    n.title.toLowerCase().includes(title.toLowerCase())
  );
  res.status(200).json(results);
});

// get a single note by id
app.get('/notes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const note = notes.find(n => n.id === id);
  if (!note) return res.status(404).json({ error: 'Note not found' });
  res.status(200).json(note);
});

// create a new note
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

// update a note
app.put('/notes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const noteIndex = notes.findIndex(n => n.id === id);
  if (noteIndex === -1) return res.status(404).json({ error: 'Note not found' });
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'title and content are required' });
  }
  notes[noteIndex] = { ...notes[noteIndex], title, content };
  res.status(200).json(notes[noteIndex]);
});

// delete a note
app.delete('/notes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = notes.length;
  notes = notes.filter(n => n.id !== id);
  if (notes.length === initialLength) {
    return res.status(404).json({ error: 'Note not found' });
  }
  res.status(204).send();
});

// global error handler

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server' });
});


// START SERVER 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(` Server running on http://localhost:${PORT}`));