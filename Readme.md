# 📘 DocuGuard AI – Legal Document Analyzer

DocuGuard AI is an AI-powered full-stack web application that analyzes legal documents for risks, extracts key clauses, and answers user questions intelligently.

---

## 🚀 Features

- ✅ Upload `.txt` or `.pdf` legal documents
- 🧠 AI-powered **document summarization**, **clause classification**, and **NER**
- ⚠️ Visual **risk-level breakdown** using dynamic charts and indicators
- ❓ Real-time **Q&A** from the document using custom context-aware prompts
- 📥 Export styled **PDF reports**
- 💡 Built with **React + FastAPI + Express** integration

---

## 🛠 Tech Stack

| Layer          | Technology                                |
|----------------|--------------------------------------------|
| Frontend       | React (Vite + TypeScript), TailwindCSS    |
| State Mgmt     | Zustand                                   |
| Backend (API)  | Express.js (Node.js)                      |
| ML/AI Engine   | FastAPI + Transformers (HuggingFace)      |
| PDF Export     | jsPDF + html2canvas                       |
| Uploads        | multer                                    |

---

## 🖼️ Demo

![DocuGuard Screenshot](./assets/demo-preview.png)

---

## 📁 Project Structure

project-8/
├── client/ # React frontend
│ ├── src/
│ │ ├── components/
│ │ ├── pages/ # UploadPage, AnalysisPage, ReportPage
│ │ └── lib/ # Zustand store
├── server/ # Express server
│ └── server.js
├── ml-service/ # FastAPI ML engine (summarize, classify, NER, QA)
│ └── app.py


---

## ⚙️ Installation

### 🔧 1. Clone the repo

```bash
git clone https://github.com/rushyy.prajapati/docuguard-ai.git
cd docuguard-ai

🧠 2. Start the FastAPI ML service

cd ml-service
python -m venv venv
source venv/bin/activate     # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app:app --reload --port 8000

🌐 3. Start the Express backend

cd server
npm install
node server.js

💻 4. Start the React frontend

cd client
npm install
npm run dev
Open your browser at: http://localhost:5173

📤 PDF Export
Click Download Report in the /report page to export a fully styled document snapshot. Uses html2canvas and jsPDF.

📦 API Endpoints
Express (port 5000)
Method	Route	Description
POST	/upload	Upload a .txt or .pdf file
POST	/analyze	Analyze uploaded content
POST	/ask	Ask a question about the document
GET	/api/summary	Get summary
GET	/api/clauses	Get classified clauses
GET	/api/risk-data	Get clause risk statistics

🧪 Test Prompts
Try questions like:

"What are the indemnification terms?"

"Can the agreement be modified unilaterally?"

"How long is the license valid?"

📌 Todo / Improvements
 Support more file formats (.docx, .pdf)

 Auto email reports

 Secure uploads via cloud storage

 Role-based user authentication

🙌 Acknowledgments
HuggingFace Transformers

OpenAI & GPT-like summarizers

Lucide Icons

TailwindCSS

ChatGPT (for debugging + UI help 😊)

📄 License
MIT License © 2025 Rushi Prajapati

yaml

---

Let me know if you want me to generate a custom `demo-preview.png` or deploy instructions for Vercel/Render!






