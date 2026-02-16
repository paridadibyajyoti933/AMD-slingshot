# DeepWork OS - Quick Start Guide (SQLite Version)

## ✅ SQLite Configuration Complete!

DeepWork OS is now configured to use **SQLite** instead of PostgreSQL for quick testing. No database installation required!

## 🚀 Quick Start (3 Steps)

### Step 1: Install Ollama (for AI features)

1. Download Ollama from: https://ollama.ai
2. Install and run:
   ```bash
   ollama pull mistral
   ```

### Step 2: Start Backend

**Option A: Using the startup script (Recommended)**
```bash
# Double-click this file or run:
start-backend.bat
```

**Option B: Manual start**
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: http://localhost:8000
API Docs: http://localhost:8000/docs

### Step 3: Start Frontend

**Option A: Using the startup script (Recommended)**
```bash
# Double-click this file or run:
start-frontend.bat
```

**Option B: Manual start**
```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at: http://localhost:5173

---

## 📁 Database Location

SQLite database will be created at:
```
backend/deepwork.db
```

All your data is stored locally in this single file.

---

## 🎯 What Changed from PostgreSQL?

✅ **Removed:**
- PostgreSQL installation requirement
- Database server setup
- User/password configuration

✅ **Added:**
- SQLite database (single file)
- aiosqlite driver
- Automatic database creation

✅ **Same Features:**
- All AI capabilities work identically
- Same API endpoints
- Same frontend functionality

---

## 🔧 Troubleshooting

### Backend won't start
```bash
# Check Python version (needs 3.10+)
python --version

# Install dependencies manually
cd backend
python -m pip install -r requirements.txt
```

### Frontend won't start
```bash
# Check Node.js version (needs 18+)
node --version

# Install dependencies manually
cd frontend
npm install
```

### Ollama connection failed
```bash
# Check if Ollama is running
ollama list

# If not, start it and pull the model
ollama pull mistral
```

---

## 📊 Features Ready to Use

1. **Research Copilot** - Upload PDFs, get AI summaries and citations
2. **Smart Weekly Planner** - Create tasks, optimize schedule
3. **Meeting Summarizer** - Process transcripts
4. **Knowledge Hub** - Semantic search across all content

---

## 🔄 Switching Back to PostgreSQL (Optional)

If you later want to use PostgreSQL:

1. Install PostgreSQL
2. Update `backend/app/config.py`:
   ```python
   DATABASE_URL: str = "postgresql+asyncpg://user:pass@localhost:5432/deepwork_db"
   ```
3. Install PostgreSQL drivers:
   ```bash
   pip install asyncpg psycopg2-binary
   ```

---

**Ready to go! Start the backend and frontend, then visit http://localhost:5173**
