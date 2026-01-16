# RTSP Livestream Overlay Web Application

A full-stack web application that plays livestream video from RTSP sources and allows users to create, manage, and display custom overlays on top of the video in real time.

## Features

- 🎥 **Livestream Playback**: Play RTSP streams with basic controls (Play, Pause, Volume)
- 🖼️ **Overlay Management**: Add text and image overlays on top of the video
- 🖱️ **Drag & Drop**: Freely position overlays anywhere on the video
- 📐 **Resizable Overlays**: Resize overlays to fit your needs
- 💾 **Persistent Storage**: All overlays are saved to MongoDB
- 🔄 **Real-time Updates**: Changes are reflected immediately

## Tech Stack

- **Backend**: Python (Flask)
- **Database**: MongoDB
- **Frontend**: React
- **Video Streaming**: HLS/RTSP via ffmpeg conversion

## Project Structure

```
livesit_assignment/
├── backend/
│   ├── app.py              # Main Flask application
│   ├── config.py           # Configuration settings
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   └── App.jsx         # Main App component
│   └── package.json        # Node dependencies
└── README.md
```

## Prerequisites

- Python 3.8+
- Node.js 16+
- MongoDB (running locally or MongoDB Atlas)
- FFmpeg (for RTSP to HLS conversion)

## Installation

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python app.py
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/livestream_overlay
FLASK_ENV=development
FLASK_SECRET_KEY=your-secret-key
```

## API Endpoints

### Overlays

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/overlays` | Get all overlays |
| POST | `/api/overlays` | Create new overlay |
| GET | `/api/overlays/<id>` | Get overlay by ID |
| PUT | `/api/overlays/<id>` | Update overlay |
| DELETE | `/api/overlays/<id>` | Delete overlay |

### Stream Settings

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/settings` | Get stream settings |
| PUT | `/api/settings` | Update stream settings |

## Usage

1. Start MongoDB
2. Start the Flask backend
3. Start the React frontend
4. Enter an RTSP URL or use the default stream
5. Click Play to start the livestream
6. Add overlays using the sidebar controls
7. Drag and resize overlays as needed

## License

MIT License
