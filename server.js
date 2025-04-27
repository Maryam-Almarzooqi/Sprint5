const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from the same folder as server.js
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
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
