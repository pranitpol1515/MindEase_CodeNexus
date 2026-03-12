# MindEase 🧠

A comprehensive mental health and wellness platform that combines AI-powered chatbots, mood tracking, meditation, counselor services, and personalized mental health features to support users' emotional well-being.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### User Features

- **AI Chatbot** - Intelligent conversational AI for mental health support
- **Mood Scanner** - Analyze and track your emotional state with emotion detection
- **Mood Tracker** - Log and visualize your mood patterns over time
- **Meditation** - Guided meditation sessions for stress relief
- **Music Therapy** - Curated music playlists for emotional wellness
- **Day Planner** - Schedule and manage your daily activities
- **Game Zone** - Engaging games for mental relaxation and entertainment
- **Counselor Services** - Connect with professional counselors
- **Motivation** - Daily motivational content and affirmations

### Admin Features

- **Admin Dashboard** - Manage users, counselors, and content
- **User Management** - View and manage platform users
- **Counselor Management** - Approve and manage counselor applications

### Counselor Features

- **Counselor Dashboard** - Manage client sessions and profiles
- **Application Portal** - Apply to become a counselor on the platform
- **Client Management** - View and manage assigned clients

## 🛠 Tech Stack

### Frontend

- **React** - UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **i18n** - Internationalization support (multi-language)
- **Axios** - HTTP client for API calls

### Backend

- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI web server
- **MongoDB** - NoSQL database
- **Google Generative AI / Gemini** - AI model for chatbot
- **Python-Jose** - JWT authentication
- **Passlib & Bcrypt** - Password hashing and security
- **OpenCV & Pillow** - Image processing for emotion detection

### AI & ML

- **google-generativeai** - AI-powered chatbot responses
- **opencv-python** - Real-time emotion detection from video/images
- **Emotion Detection** - Custom ML model for mood analysis

## 📦 Installation

### Prerequisites

- **Node.js** (v16 or higher) - For frontend
- **Python** (v3.8 or higher) - For backend
- **MongoDB** - Running locally or remote connection

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

3. Configure your API keys in `.env`:

```
GOOGLE_API_KEY=your_google_api_key  # Recommended
# OR
GEMINI_API_KEY=your_gemini_api_key

MONGODB_URI=mongodb://localhost:27017/mindease
JWT_SECRET=your_secret_key
```

4. Install Python dependencies:

```bash
pip install -r requirement.txt
```

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install Node.js dependencies:

```bash
npm install
```

3. (Optional) Create `.env.local` to configure backend URL:

```
VITE_API_URL=http://localhost:8080
```

## 🚀 Running the Application

### Start Backend (FastAPI)

```bash
cd backend
python main.py
```

Backend runs on `http://localhost:8080` by default.

Or use the batch file on Windows:

```bash
cd backend
start_backend.bat
```

### Start Frontend (Vite)

```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:5173` by default.

### Access the Application

- **User Portal** - `http://localhost:5173`
- **Backend API** - `http://localhost:8080`
- **API Docs** - `http://localhost:8080/docs`

## 📁 Project Structure

```
MindEase/
├── backend/                    # FastAPI backend server
│   ├── main.py                # Application entry point
│   ├── requirement.txt         # Python dependencies
│   ├── ai/                     # AI modules
│   │   ├── chatbot.py         # ChatBot logic
│   │   └── emotion_detection.py # Emotion detection
│   ├── database/              # Database config
│   │   └── database.py        # MongoDB connection
│   ├── models/                # Database models
│   │   └── user.py            # User model
│   └── routes/                # API endpoints
│       ├── auth.py            # Authentication routes
│       ├── chat.py            # Chat routes
│       ├── mood.py            # Mood tracking routes
│       ├── journal.py         # Journal routes
│       ├── schedule.py        # Schedule routes
│       └── admin.py           # Admin routes
│
├── frontend/                   # React + Vite frontend
│   ├── src/
│   │   ├── main.jsx           # React entry point
│   │   ├── App.jsx            # Main App component
│   │   ├── i18n.js            # Internationalization
│   │   ├── components/        # Reusable components
│   │   │   ├── ChatBot.jsx
│   │   │   ├── MoodScanner.jsx
│   │   │   ├── Meditation.jsx
│   │   │   ├── MusicTherapy.jsx
│   │   │   └── ...
│   │   ├── pages/             # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ChatPage.jsx
│   │   │   └── ...
│   │   ├── services/          # API services
│   │   │   └── api.js         # API configuration
│   │   └── assets/            # Static assets
│   └── package.json
│
├── package.json               # Root package config
├── README.md                  # This file
└── sitecustomize.py          # Python path configuration
```

## 🔌 API Documentation

The FastAPI backend automatically generates interactive API documentation:

- **Swagger UI** - `http://localhost:8080/docs`
- **ReDoc** - `http://localhost:8080/redoc`

### Main API Endpoints

**Authentication:**

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout

**Chat:**

- `POST /api/chat/message` - Send message to chatbot
- `GET /api/chat/history` - Get chat history

**Mood:**

- `POST /api/mood/log` - Log mood entry
- `GET /api/mood/history` - Get mood history
- `POST /api/mood/detect` - Detect emotion from image

**Admin:**

- `GET /api/admin/users` - Get all users
- `GET /api/admin/counselors` - Get counselor applications

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the development team.

---

**Made with ❤️ for mental wellness**
