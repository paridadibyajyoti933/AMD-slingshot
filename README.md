# DeepWork OS

**A local-first AI productivity operating system for students, researchers, and early professionals.**

DeepWork OS integrates research summarization, smart scheduling, meeting transcription, and knowledge capture into a unified AI-driven dashboard.

## 🚀 Features

### 1. Research Copilot
- Upload PDF research papers
- AI-powered extraction of:
  - Abstract
  - Key contributions
  - Methodology
  - Limitations
  - Important equations
- Generate citations (APA, IEEE, BibTeX)
- Create literature review paragraphs
- Semantic search across papers

### 2. Smart Weekly Planner
- Task management with deadlines
- AI-driven priority scoring algorithm
- Schedule optimization with deep work blocks
- Deadline risk detection
- Energy-level based time slot suggestions

### 3. Meeting/Class Summarizer
- Upload meeting transcripts
- AI-generated summaries
- Extract key points, decisions, and action items
- Store in searchable knowledge base

### 4. Knowledge Hub
- Semantic search across all content
- Vector-powered similarity search (FAISS)
- Cross-document retrieval
- Unified search interface

## 🛠️ Tech Stack

**Backend:**
- FastAPI (Python)
- PostgreSQL (Database)
- SQLAlchemy (ORM)
- FAISS (Vector Store)
- Ollama (Local LLM)
- SentenceTransformers (Embeddings)

**Frontend:**
- React 18
- Vite
- TailwindCSS
- React Router
- Axios

**AI Layer:**
- Local LLM via Ollama (Mistral/LLaMA compatible)
- SentenceTransformers for embeddings
- FAISS for vector similarity search

## 📋 Prerequisites

- **Python 3.10+**
- **Node.js 18+**
- **PostgreSQL 14+**
- **Ollama** (for local LLM inference)

## 🔧 Installation

### 1. Clone the Repository
```bash
cd deepwork-os
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Database Setup

```bash
# Create PostgreSQL database
createdb deepwork_db

# Or using psql:
psql -U postgres
CREATE DATABASE deepwork_db;
CREATE USER deepwork WITH PASSWORD 'deepwork123';
GRANT ALL PRIVILEGES ON DATABASE deepwork_db TO deepwork;
\q
```

### 4. Ollama Setup

```bash
# Install Ollama from https://ollama.ai

# Pull the Mistral model
ollama pull mistral

# Verify Ollama is running
ollama list
```

### 5. Environment Configuration

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your settings
# Update DATABASE_URL if needed
```

### 6. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install
```

## 🚀 Running the Application

### Start Backend

```bash
cd backend

# Activate virtual environment
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

# Run FastAPI server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: `http://localhost:8000`
API Documentation: `http://localhost:8000/docs`

### Start Frontend

```bash
cd frontend

# Run development server
npm run dev
```

Frontend will be available at: `http://localhost:5173`

### Ensure Ollama is Running

```bash
# Ollama should be running on port 11434
# Check with:
curl http://localhost:11434/api/tags
```

## 📁 Project Structure

```
deepwork-os/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application
│   │   ├── config.py            # Configuration
│   │   ├── database.py          # Database setup
│   │   ├── models/              # SQLAlchemy models
│   │   ├── routes/              # API endpoints
│   │   └── services/            # Business logic
│   │       ├── ai/              # LLM, embeddings, citations
│   │       ├── pdf/             # PDF parsing
│   │       ├── scheduler/       # Schedule optimization
│   │       └── vector/          # FAISS vector store
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   ├── pages/               # Page components
│   │   ├── services/            # API client
│   │   ├── App.jsx              # Main app component
│   │   └── main.jsx             # Entry point
│   └── package.json
├── data/                        # Created at runtime
│   ├── pdfs/                    # Uploaded PDFs
│   ├── uploads/                 # Other uploads
│   └── faiss_index/             # Vector index
├── .env.example                 # Environment template
└── README.md
```

## 🎯 Usage Guide

### 1. Research Copilot

1. Navigate to **Research Copilot**
2. Click **Upload PDF** and select a research paper
3. Wait for AI processing (30-60 seconds)
4. View extracted sections and citations
5. Copy citations in APA, IEEE, or BibTeX format

### 2. Weekly Planner

1. Go to **Weekly Planner**
2. Click **New Task** to create tasks
3. Set title, deadline, priority, and estimated hours
4. Click **Optimize Schedule** for AI-generated plan
5. View deep work block suggestions

### 3. Meeting Summarizer

1. Open **Meetings** page
2. Paste transcript or upload text file
3. AI generates summary with:
   - Key points
   - Decisions made
   - Action items

### 4. Knowledge Hub

1. Navigate to **Knowledge Hub**
2. Enter search query
3. Get semantically relevant results from:
   - Research papers
   - Meeting notes
   - Summaries

## 🔒 Security Notes

- **Change the SECRET_KEY** in `.env` for production
- DeepWork OS runs **locally** - your data never leaves your machine
- All AI processing happens via local Ollama instance

## 🐛 Troubleshooting

### Backend won't start
- Check PostgreSQL is running: `pg_isready`
- Verify database exists: `psql -l | grep deepwork`
- Check Python version: `python --version` (needs 3.10+)

### Ollama connection failed
- Ensure Ollama is running: `ollama list`
- Check Ollama URL in `.env`: `OLLAMA_BASE_URL=http://localhost:11434`
- Pull model: `ollama pull mistral`

### Frontend can't connect to backend
- Verify backend is running on port 8000
- Check CORS settings in `backend/app/config.py`
- Ensure proxy is configured in `frontend/vite.config.js`

### PDF upload fails
- Check `data/pdfs/` directory exists and is writable
- Verify file is a valid PDF
- Check backend logs for errors

## 📊 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🤝 Contributing

This is a production-ready prototype. Feel free to:
- Add new AI models
- Implement additional features
- Improve the UI/UX
- Optimize performance

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🙏 Acknowledgments

- **Ollama** for local LLM inference
- **FAISS** for vector similarity search
- **SentenceTransformers** for embeddings
- **FastAPI** for the backend framework
- **React** and **TailwindCSS** for the frontend

---

**Built with ❤️ for deep, focused work.**
