# Build frontend
FROM node:18 AS frontend-builder
WORKDIR /app/frontend
COPY AI-Code-Agent/frontend/package*.json ./
RUN npm install
COPY AI-Code-Agent/frontend/ ./
RUN npm run build

# Build backend
FROM python:3.10-slim
WORKDIR /app

# Copy backend requirements and install
COPY AI-Code-Agent/backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend code
COPY AI-Code-Agent/backend/ ./backend/

# Copy built frontend from frontend-builder
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Expose port
EXPOSE 8000

# Set environment variable for port (Render uses PORT)
ENV PORT=8000

# Run uvicorn from the backend directory
WORKDIR /app/backend
CMD sh -c "uvicorn app.main:app --host 0.0.0.0 --port ${PORT}"
