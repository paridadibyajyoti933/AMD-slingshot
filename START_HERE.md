# 🚀 DeepWork OS - Start Instructions

## ✅ Ollama Installed!
Great! Now let's start the application.

## 📍 Important: You need to be in the `deepwork-os` folder!

Your project is located at:
```
c:\Users\DIBYAJYOTI PARIDA\Desktop\AMD slingshot\deepwork-os
```

## 🎯 Step-by-Step Instructions

### 1. Pull Mistral Model (Already Running)
You're already running `ollama pull mistral` - let it finish!

### 2. Start Backend

Open a **NEW terminal** and run:

```powershell
cd "c:\Users\DIBYAJYOTI PARIDA\Desktop\AMD slingshot\deepwork-os\backend"
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

✅ Backend will run on: http://localhost:8000

### 3. Start Frontend

Open **ANOTHER terminal** and run:

```powershell
cd "c:\Users\DIBYAJYOTI PARIDA\Desktop\AMD slingshot\deepwork-os\frontend"
npm install
npm run dev
```

✅ Frontend will run on: http://localhost:5173

---

## 🎉 Access the Application

Once both are running, open your browser and go to:
**http://localhost:5173**

---

## 📝 Quick Commands (Copy-Paste Ready)

### Terminal 1 - Backend:
```powershell
cd "c:\Users\DIBYAJYOTI PARIDA\Desktop\AMD slingshot\deepwork-os\backend"
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Terminal 2 - Frontend:
```powershell
cd "c:\Users\DIBYAJYOTI PARIDA\Desktop\AMD slingshot\deepwork-os\frontend"
npm install
npm run dev
```

---

## ⚠️ Common Issues

**"Cannot find path backend"**
- Make sure you're in the `deepwork-os` folder first!
- Use the full path: `cd "c:\Users\DIBYAJYOTI PARIDA\Desktop\AMD slingshot\deepwork-os"`

**"py is not recognized"**
- Use `python` instead of `py`
- Your system has `python.exe` installed

**Ollama not responding**
- Wait for `ollama pull mistral` to finish
- Check if Ollama is running: `ollama list`

---

## 🎨 What You Can Do

1. **Research Copilot** - Upload PDF papers, get AI summaries
2. **Weekly Planner** - Create tasks, optimize your schedule
3. **Knowledge Hub** - Search all your content semantically
4. **Meetings** - Summarize transcripts with AI

---

**Ready? Start the backend and frontend in separate terminals!**
