# ⚡ AI Software Engineering Platform (Autonomous Multi-Agent Workspace)

A production-ready, high-fidelity autonomous AI software engineering platform. Inspired by next-generation AI IDE workspaces like Cursor and ChatGPT, this platform features a full-stack architecture comprising a modular React + Vite frontend, a secure FastAPI backend, and an intelligent routing layer optimized for **Groq (Llama-3)** and **OpenAI**.

---

## 🏗️ System Workflow

The architecture is built for real-time interactivity, session state persistence, and low-latency AI responses.

```mermaid
graph TD
    A[Developer / Client UI] -->|JWT Auth Header| B[FastAPI Gateway]
    B -->|Route Handler| C[Auth & User Service]
    B -->|Route Handler| D[Chat & Session Service]
    B -->|Route Handler| E[Playground Services]
    
    C -->|CRUD Operations| F[(SQLite Database)]
    D -->|Session History| F
    
    D -->|Request Routing| G[AI Model Dispatcher]
    E -->|Request Routing| G
    
    G -->|Primary: Groq API| H[Groq Llama-3-70b]
    G -->|Secondary/Fallback| I[OpenAI GPT-4o-mini]
```

### End-to-End Flow
1. **User Request**: The developer interacts with the interface (Chat or Playground) to generate, debug, explain, or optimize code.
2. **Gateway Dispatch**: FastAPI receives the request, validates the JWT access token, and loads the active session history from SQLite.
3. **AI Dispatcher**: The request payload is dispatched through the AI Routing layer. By default, it prioritizes **Groq Llama-3** (configured via the user's custom Groq API key) for sub-second code generation, with a fallback to **OpenAI** or standard offline mock responses.
4. **Context Assembly**: The model response is formatted, streamed/returned to the client, and persisted back to the database.

---

## 🌟 Core Features

### 1. 💬 Chat Workspace (Interactive & Multi-Session)
- **ChatGPT-Style Layout**: Sidebar featuring active conversations list, session history database persistence, and rapid action triggers (Copy code, Download raw code).
- **Multi-Mode Interface**: Select specialized modes on the fly:
  - 💬 **Chat**: General programming conversation.
  - ⚙️ **Generate**: Generate clean, modular snippets based on software requirements.
  - 🐞 **Debug**: Analyze errors, inspect stack traces, and fetch immediate corrected scripts.
  - 📚 **Explain**: Break down complex architectures, loops, variables, and complexities.
  - ⚡ **Optimize**: Improve readability, runtimes, and clean code principles.

### 2. 🎮 Code Playground (Multi-Mode Workspace)
- Direct sandbox environment for processing single snippets without creating full chat histories.
- Markdown code blocks rendered dynamically with Prism (One Dark syntax theme).
- Standardized layout optimized for comparison of input instructions and generated output code side-by-side.

### 3. 📊 Developer Dashboard
- **Total Chats Counter**: Visual display of active threads in the database.
- **Messages Sent Tracker**: Analytics showing total number of message iterations.
- **AI Model Status**: Displays the active LLM engine (e.g., **Groq**).
- **Status Health Monitor**: Quick indicator showing connectivity to the backend services.
- **Quick Actions**: Deep links to instantly create new workspaces.

---

## 🛠️ Tech Stack & Structure

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Lucide icons, Prism React Syntax Highlighter.
- **Backend**: Python, FastAPI, SQLAlchemy (SQLite ORM), JWT (Jose), Uvicorn.

```text
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI application entry point
│   │   ├── config.py        # Settings loader with pydantic env validation
│   │   ├── models.py        # SQLAlchemy relational database models
│   │   ├── schemas.py       # Pydantic schemas for data serialization
│   │   ├── database.py      # SQLite connection setup
│   │   └── ai_service.py    # AI Client orchestration layer (Groq/OpenAI)
│   └── .env                 # Environment variables config
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Common UI components
│   │   ├── context/         # AuthContext provider
│   │   ├── pages/           # Chat, Dashboard, Playground, Login, Profile
│   │   ├── services/        # Axios API configurations
│   │   └── App.tsx          # Router and app shell mounting
│   └── .env                 # Frontend system configs
```

---

## 🚀 Getting Started

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv .venv
   .venv\Scripts\activate      # Windows
   source .venv/bin/activate    # macOS/Linux
   ```
3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure your environment variables. Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```
   Modify `.env` and set:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   GROQ_MODEL=llama-3.3-70b-versatile
   DATABASE_URL=sqlite:///./app.db
   ```
5. Run the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Ensure `.env` is pointing to the correct API endpoint:
   ```env
   VITE_API_URL=http://localhost:8000
   ```
4. Start the frontend developer server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to: [http://localhost:5173](http://localhost:5173)

---

## 🔒 Security & Performance Features
- **JWT Authorization**: Encrypted tokens securely pass through HTTP request headers (`Authorization: Bearer <token>`).
- **Prism Rendering Fix**: Custom `codeTagProps` applied to remove default inline block backgrounds from raw Prism themes, preventing visual styling bugs on nested code text blocks.
- **Robust Model Fallbacks**: Graceful error handling for API 429 quota exhaustion or missing api key contexts, presenting readable error cards to the user.
