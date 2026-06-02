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

// Member 1 → GET /notes (get all notes)

// Member 1 → GET /notes/:id (get single note)

// Create a new note
app.post('/notes', (req, res) => {
    const {title, content} = req.body;
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