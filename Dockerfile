# ── Stage 1: Build frontend ──────────────────────────────────────────────────
FROM node:18-slim AS frontend-builder
WORKDIR /app/frontend
COPY AI-Code-Agent/frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY AI-Code-Agent/frontend/ ./
RUN npm run build

# ── Stage 2: Production image ─────────────────────────────────────────────────
FROM python:3.10-slim
WORKDIR /app

# Install backend deps
COPY AI-Code-Agent/backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend source
COPY AI-Code-Agent/backend/ ./backend/

# Copy compiled frontend assets
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Ensure the data directory exists for SQLite
RUN mkdir -p /data

EXPOSE 8000
ENV PORT=8000

WORKDIR /app/backend
CMD sh -c "uvicorn app.main:app --host 0.0.0.0 --port ${PORT}"
