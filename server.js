const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Temporary in-memory storage
let tasks = [];
let session = {};

// Middleware
app.use(express.json());

// API Routes

// Serve index.html manually
app.get(['/', '/index.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve script.js manually
app.get('/script.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'script.js'));
});

// Serve Aboutus manually
app.get('/AboutUs.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'AboutUs.html'));
});

// Serve Aboutus manually
app.get('/WhyThisWorks.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'WhyThisWorks.html'));
});


// API endpoints
app.post('/api/setTheme', (req, res) => {
    console.log('Theme set to:', req.body.theme);
    res.json({ status: 'ok' });
});

app.post('/api/selectTechnique', (req, res) => {
    console.log('Technique selected:', req.body.technique);
    res.json({ status: 'ok' });
});

app.post('/api/addTask', (req, res) => {
    console.log('Task added:', req.body.task);
    res.json({ status: 'ok' });
});

app.post('/api/startGame', (req, res) => {
    console.log('Game started with:', req.body);
    res.json({ status: 'ok' });
});

app.post('/api/rewardEarned', (req, res) => {
    console.log('Reward earned:', req.body.reward);
    res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


