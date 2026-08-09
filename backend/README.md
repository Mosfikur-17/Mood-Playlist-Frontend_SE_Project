# Mood-Driven Coding Playlist Generator — FastAPI Backend

Modular, production-ready Python FastAPI backend integrated with MongoDB Atlas and YouTube Data API v3.

## Technology Stack
- **Framework**: FastAPI (Python 3.11+)
- **Server**: Uvicorn
- **Database**: MongoDB (via PyMongo)
- **Validation**: Pydantic v2
- **External Integration**: YouTube Data API v3
- **Authentication**: JWT & Password Hashing (bcrypt)
- **Testing**: pytest

## Directory Structure
```text
backend/
├── app/
│   ├── main.py              # FastAPI Application Entrypoint & Middleware
│   ├── core/                # Configuration & Security Utilities
│   ├── database/            # MongoDB Connection Manager & Indexing
│   ├── models/              # MongoDB Document Factories
│   ├── schemas/             # Pydantic Request/Response Schemas
│   ├── routes/              # API Endpoints (health, auth, youtube, recommendations, playlists)
│   └── services/            # YouTube, Recommendation & Playlist Business Logic
├── tests/                   # Pytest Automated Test Suite
├── .env.example             # Environment Variable Template
├── Dockerfile               # Container Deployment Config
├── requirements.txt         # Dependencies List
└── README.md
```

## Setup & Running Locally

1. **Create Virtual Environment**:
   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # Linux/macOS:
   source .venv/bin/activate
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Environment**:
   Copy `.env.example` to `.env` and configure your credentials:
   ```env
   MONGODB_URI=mongodb://localhost:27017
   DATABASE_NAME=mood_playlist_db
   YOUTUBE_API_KEY=your_youtube_api_key_here
   JWT_SECRET=your_jwt_secret_key
   FRONTEND_URL=http://localhost:4200
   ```

4. **Start Development Server**:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   Interactive OpenAPI documentation is available at:
   - **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
   - **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

5. **Run Tests**:
   ```bash
   pytest
   ```

## Deployment Readiness
- **Render / Railway / Heroku**: Deploys out of the box using `requirements.txt` or `Dockerfile`.
- **Port Handling**: Automatically binds to `$PORT` provided by platform environment.
- **MongoDB Atlas**: Compatible with connection string `mongodb+srv://...` in `MONGODB_URI`.
