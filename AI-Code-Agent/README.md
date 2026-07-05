# AI Code Generation Agent

A production-ready AI coding assistant inspired by ChatGPT, built with React, TypeScript, Tailwind, FastAPI, SQLAlchemy, JWT, and OpenAI.

## Features

- User registration and login with JWT auth
- Chat-based coding assistant
- Code generation, debugging, explanation, optimization, SQL, and API generation
- Dark modern UI with a ChatGPT-inspired workspace
- Monaco code editor
- PDF/Markdown/Text download support
- Chat history persistence
- Profile and admin pages

## Project Structure

- frontend/ - React + Vite + Tailwind + TypeScript application
- backend/ - FastAPI API with auth, database models, and AI integration
- docs/ - API and deployment documentation

## Quick Start

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

Edit `backend/.env` and set:

```text
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
```

Then start the backend:

```bash
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and update values.

Required values for ChatGPT-style AI responses:

- `OPENAI_API_KEY` — your OpenAI API key
- `OPENAI_MODEL` — e.g. `gpt-4o-mini`, `gpt-4.1-mini`, or another supported ChatGPT-compatible model

If `OPENAI_API_KEY` is not set, the app will still run locally with fallback responses.

## Docker

```bash
docker compose up --build
```
