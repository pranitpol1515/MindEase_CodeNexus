# MindEase

## Run (AI features included)

### Backend (FastAPI)

- Create `backend/.env` (copy from `backend/.env.example`)
- Set **one** of:
  - `GOOGLE_API_KEY=...` (recommended), or
  - `GEMINI_API_KEY=...`

Then:

```bash
cd backend
pip install -r requirement.txt
python main.py
```

Backend runs on `http://localhost:8080` by default.

### Frontend (Vite)

```bash
cd frontend
npm install
npm run dev
```

Optional: point the frontend to a different backend URL by setting `VITE_API_URL` in `frontend/.env.local`.