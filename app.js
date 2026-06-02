const express = require('express');
const app = express();

app.use(express.json());

// Our fake database - just a list
let notes = [];
let id = 1;

// CREATE a note
app.post('/notes', (req, res) => {
    const note = { id: id++, title: req.body.title, content: req.body.content };
    notes.push(note);
    res.json(note);
});

// GET all notes
app.get('/notes', (req, res) => {
    res.json(notes);
});

// GET one note
app.get('/notes/:id', (req, res) => {
    const note = notes.find(n => n.id == req.params.id);
    res.json(note);
});

// UPDATE a note
app.put('/notes/:id', (req, res) => {
    const note = notes.find(n => n.id == req.params.id);
    note.title = req.body.title;
    note.content = req.body.content;
    res.json(note);
});

// DELETE a note
app.delete('/notes/:id', (req, res) => {
    notes = notes.filter(n => n.id != req.params.id);
    res.json({ message: 'Note deleted' });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});