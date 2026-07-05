# Deployment Guide

## Local Development

1. Create and activate a Python virtual environment in backend.
2. Install Python dependencies from backend/requirements.txt.
3. Create backend/.env from backend/.env.example.
4. Install frontend dependencies with npm install.
5. Start the backend with uvicorn and the frontend with npm run dev.

## Docker Deployment

```bash
docker compose up --build
```

## Production Notes

- Configure a real MySQL instance and updated `DATABASE_URL`.
- Set `OPENAI_API_KEY` to a valid key.
- Set `OPENAI_MODEL` to a supported model such as `gpt-4o-mini` or `gpt-4.1-mini`.
- Use HTTPS, environment-based secrets, and reverse proxying in production.
