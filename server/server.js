const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();

// ✅ ENV VARIABLES
const ML_SERVICE_URL = (process.env.ML_SERVICE_URL || 'http://localhost:8000').replace(/\/$/, '');
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const PORT = process.env.PORT || 5050;

if (!OPENAI_API_KEY) {
  console.error('❌ Missing OPENAI_API_KEY');
  process.exit(1);
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// ✅ CORS FIX (important for Vercel)
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
}));

app.use(express.json());

// ✅ Ensure uploads folder exists (Render fix)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: uploadsDir,
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
      return res.status(400).json({ error: 'Only PDF and DOCX allowed.' });
    }

    console.log('📄 Uploaded:', absolutePath);

    res.status(200).json({
      message: 'File uploaded',
      extractedText,
    });

  } catch (err) {
    console.error('❌ Extraction error:', err.message);
    res.status(500).json({ error: 'Failed to extract text' });
  }
});

// ✅ Analyze endpoint
app.post('/analyze', async (req, res) => {
  const { text } = req.body;

  if (!text || text.length < 10) {
    return res.status(400).json({ error: 'Invalid text' });
  }

  try {
    const [summaryRes, nerRes, classifyRes] = await Promise.all([
      axios.post(`${ML_SERVICE_URL}/summarize`, { text }),
      axios.post(`${ML_SERVICE_URL}/ner`, { text }),
      axios.post(`${ML_SERVICE_URL}/classify`, { text }),
    ]);

    cachedSummary = summaryRes.data.summary;
    cachedClauses = classifyRes.data.classification;
    cachedRiskData = classifyRiskData(cachedClauses);

    res.json({
      summary: cachedSummary,
      entities: nerRes.data.entities,
      classification: cachedClauses,
    });

  } catch (err) {
    console.error('❌ Analyze error:', err.message);
    res.status(500).json({ error: 'Analysis failed', detail: err.message });
  }
});

// ✅ Chat endpoint (OpenAI)
app.post('/chat', async (req, res) => {
  const { question, context } = req.body;

  if (!question || !context) {
    return res.status(400).json({ error: 'Missing question/context' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a legal assistant who explains contracts clearly.'
        },
        {
          role: 'user',
          content: `Context:\n${context}\n\nQuestion:\n${question}`
        }
      ],
      temperature: 0.7,
    });

    res.json({
      answer: completion.choices[0].message.content
    });

  } catch (err) {
    console.error('❌ OpenAI error:', err.message);
    res.status(500).json({ error: 'Chat failed' });
  }
});

// ✅ APIs for frontend
app.get('/api/summary', (req, res) => {
  if (!cachedSummary) return res.status(404).json({ error: 'No summary' });
  res.json(cachedSummary);
});

app.get('/api/clauses', (req, res) => {
  if (!cachedClauses.length) return res.status(404).json({ error: 'No clauses' });
  res.json(cachedClauses);
});

app.get('/api/risk-data', (req, res) => {
  if (!cachedRiskData.length) return res.status(404).json({ error: 'No risk data' });
  res.json(cachedRiskData);
});

// ✅ Risk logic
function classifyRiskData(clauses) {
  const levels = {
    'High Risk': { count: 0, color: '#ef4444' },
    'Medium Risk': { count: 0, color: '#f59e0b' },
    'Low Risk': { count: 0, color: '#0ea5e9' },
    'No Risk': { count: 0, color: '#22c55e' },
  };

  clauses.forEach((clause) => {
    const raw = clause.riskLevel?.toLowerCase() || '';
    const parts = raw.split(/[\s,;|]+/);

    parts.forEach((p) => {
      let level = 'No Risk';
      if (p.includes('anger') || p.includes('fear')) level = 'High Risk';
      else if (p.includes('sad') || p.includes('surprise')) level = 'Medium Risk';
      else if (p.includes('joy') || p.includes('neutral')) level = 'Low Risk';

      levels[level].count += 1;
    });
  });

  return Object.entries(levels).map(([riskLevel, data]) => ({
    riskLevel,
    ...data,
  }));
}

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});