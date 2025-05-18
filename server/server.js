const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { OpenAI } = require('openai');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const app = express();

// ✅ Load env
const ML_SERVICE_URL = process.env.ML_SERVICE_URL?.replace(/\/$/, '');
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const PORT = process.env.PORT || 5050;

if (!ML_SERVICE_URL || !OPENAI_API_KEY) {
  console.error('❌ Missing ML_SERVICE_URL or OPENAI_API_KEY in .env');
  process.exit(1);
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// ✅ Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
}));
app.use(express.json());

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// ✅ Cache
let cachedSummary = null;
let cachedClauses = [];
let cachedRiskData = [];

// ✅ Upload endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const absolutePath = path.resolve(req.file.path);
  const ext = path.extname(absolutePath).toLowerCase();
  const fileBuffer = fs.readFileSync(absolutePath);
  let extractedText = '';

  try {
    if (ext === '.pdf') {
      const pdfData = await pdfParse(fileBuffer);
      extractedText = pdfData.text;
    } else if (ext === '.docx') {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      extractedText = result.value;
    } else {
      return res.status(400).json({ error: 'Unsupported file type. Only PDF and DOCX allowed.' });
    }

    console.log('📄 Uploaded:', absolutePath);
    res.status(200).json({ message: 'File uploaded', filePath: absolutePath, extractedText });
  } catch (err) {
    console.error('❌ Extraction error:', err.message);
    res.status(500).json({ error: 'Failed to extract text from document' });
  }
});

// ✅ Analyze endpoint (ML service)
app.post('/analyze', async (req, res) => {
  const { text } = req.body;
  if (!text || text.length < 10) return res.status(400).json({ error: 'Invalid document text.' });

  try {
    const [summaryRes, nerRes, classifyRes] = await Promise.all([
      axios.post(`${ML_SERVICE_URL}/summarize`, { text }),
      axios.post(`${ML_SERVICE_URL}/ner`, { text }),
      axios.post(`${ML_SERVICE_URL}/classify`, { text }),
    ]);

    cachedSummary = summaryRes.data.summary;
    cachedClauses = classifyRes.data.classification;
    cachedRiskData = classifyRiskData(cachedClauses);

    res.status(200).json({
      summary: cachedSummary,
      entities: nerRes.data.entities,
      classification: cachedClauses,
    });
  } catch (err) {
    console.error('❌ Analyze error:', err.message);
    res.status(500).json({ error: 'Failed to analyze document', detail: err.message });
  }
});

// ✅ GPT-powered Chat Assistant
app.post('/chat', async (req, res) => {
  const { question, context } = req.body;
  if (!question || !context) return res.status(400).json({ error: 'Missing question or context.' });

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a legal document assistant who explains legal terms and risks clearly.' },
        { role: 'user', content: `Context:\n${context}\n\nQuestion:\n${question}` }
      ],
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content;
    res.status(200).json({ answer: reply });
  } catch (err) {
    console.error('❌ GPT error:', err.message);
    res.status(500).json({ error: 'Failed to get assistant response.' });
  }
});

// ✅ Frontend API
app.get('/api/summary', (req, res) => {
  if (!cachedSummary) return res.status(404).json({ error: 'Summary not available' });
  res.json(cachedSummary);
});

app.get('/api/clauses', (req, res) => {
  if (!cachedClauses.length) return res.status(404).json({ error: 'Clauses not available' });
  res.json(cachedClauses);
});

app.get('/api/risk-data', (req, res) => {
  if (!cachedRiskData.length) return res.status(404).json({ error: 'Risk data not available' });
  res.json(cachedRiskData);
});

// ✅ Risk classifier (used by charts + UI)
function classifyRiskData(clauses) {
  const levels = {
    'High Risk': { count: 0, color: '#ef4444' },
    'Medium Risk': { count: 0, color: '#f59e0b' },
    'Low Risk': { count: 0, color: '#0ea5e9' },
    'No Risk': { count: 0, color: '#22c55e' },
  };

  clauses.forEach((clause) => {
    const rawLabel = clause.riskLevel?.toLowerCase() || '';
    const labels = rawLabel.split(/[\s,;|]+/);

    labels.forEach((emotion) => {
      let level = 'No Risk';
      if (emotion.includes('anger') || emotion.includes('fear')) level = 'High Risk';
      else if (emotion.includes('sad') || emotion.includes('surprise')) level = 'Medium Risk';
      else if (emotion.includes('joy') || emotion.includes('neutral')) level = 'Low Risk';
      levels[level].count += 1;
    });
  });

  return Object.entries(levels).map(([riskLevel, data]) => ({
    riskLevel,
    ...data,
  }));
}

// ✅ Server start
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
