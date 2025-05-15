const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Multer setup
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// In-memory storage (can be replaced with database)
let cachedSummary = null;
let cachedClauses = [];
let cachedRiskData = [];

// Upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.status(200).json({ message: 'File uploaded', filePath: req.file.path });
});

// Analyze document endpoint
app.post('/analyze', async (req, res) => {
  const { filePath } = req.body;

  try {
    const fileText = fs.readFileSync(filePath, 'utf-8');

    const [summaryRes, nerRes, classifyRes] = await Promise.all([
      axios.post('http://localhost:8000/summarize', { text: fileText }),
      axios.post('http://localhost:8000/ner', { text: fileText }),
      axios.post('http://localhost:8000/classify', { text: fileText }),
    ]);

    cachedSummary = summaryRes.data.summary;
    cachedClauses = classifyRes.data.classification;
    cachedRiskData = classifyRiskData(classifyRes.data.classification);

    res.status(200).json({
      summary: cachedSummary,
      entities: nerRes.data.entities,
      classification: cachedClauses,
    });
  } catch (err) {
    console.error('❌ /analyze error:', err.message);
    res.status(500).json({ error: 'Failed to analyze document' });
  }
});

// Ask question endpoint
app.post('/ask', async (req, res) => {
  const { question, context } = req.body;

  try {
    const response = await axios.post('http://localhost:8000/ask', {
      question,
      context,
    });

    res.status(200).json({ answer: response.data.answer });
  } catch (err) {
    console.error('❌ /ask error:', err.message);
    res.status(500).json({ error: 'Failed to get answer' });
  }
});

// 🧠 Serve summary
app.get('/api/summary', (req, res) => {
  if (!cachedSummary) return res.status(404).json({ error: 'Summary not available' });
  res.json(cachedSummary);
});

// 🔍 Serve clauses
app.get('/api/clauses', (req, res) => {
  if (!cachedClauses.length) return res.status(404).json({ error: 'Clauses not available' });
  res.json(cachedClauses);
});

// 📊 Serve risk data
app.get('/api/risk-data', (req, res) => {
  if (!cachedRiskData.length) return res.status(404).json({ error: 'Risk data not available' });
  res.json(cachedRiskData);
});

// Helper: Count risk levels
function classifyRiskData(clauses) {
  const levels = {
    'High Risk': { count: 0, color: '#ef4444' },
    'Medium Risk': { count: 0, color: '#f59e0b' },
    'Low Risk': { count: 0, color: '#0ea5e9' },
    'No Risk': { count: 0, color: '#22c55e' },
  };

  clauses.forEach((clause) => {
    const level = clause.riskLevel || 'No Risk';
    if (levels[level]) levels[level].count += 1;
  });

  return Object.entries(levels).map(([riskLevel, data]) => ({
    riskLevel,
    ...data,
  }));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
