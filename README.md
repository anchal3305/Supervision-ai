# SuperVision AI 

A real-time student engagement and proctoring system using computer vision and WebSockets.

## Features
- Live webcam capture using MediaPipe FaceMesh
- Engagement detection (Focused, Neutral, Confused)
- Real-time communication via WebSockets
- Teacher dashboard with live engagement timeline

## Tech Stack
- Frontend: React, Vite, MediaPipe, Chart.js
- Backend: FastAPI, WebSockets

## How to Run

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app

### Frontend
cd frontend/supervision-ui
npm install
npm run dev

### Pages

Student: http://localhost:5173/student

Teacher: http://localhost:5173/teacher

### Author

Anchal Gupta
