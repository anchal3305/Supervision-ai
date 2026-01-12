### SuperVision AI — Real-time student engagement monitoring using Face Mesh & WebSockets with separate Student & Teacher dashboards.

## Tagline -
An AI-powered classroom supervision system that detects student engagement in real time and visualizes it live for instructors.

### Overview

SuperVision AI is a real-time AI-based classroom monitoring system designed to analyze student engagement using facial landmark detection and stream live insights to a teacher dashboard.

The system uses MediaPipe Face Mesh to detect facial expressions, FastAPI WebSockets for real-time communication, and a React + Vite frontend to display live engagement states and trends.

## Key Features

 Live Face Detection using MediaPipe Face Mesh

 Engagement Classification (Focused / Neutral / Confused)

 Real-time WebSocket Communication (Student → Teacher)

 Teacher Dashboard with live status & engagement timeline

 Student Portal with face mesh overlay & feedback

 Low-latency, event-driven architecture

## Tech Stack

# Frontend

React.js (Vite)

MediaPipe Face Mesh

Chart.js

WebSockets

# Backend

FastAPI

WebSockets (Starlette)

Python

## Architecture
Student (Camera + Face Mesh)
        ↓
 Engagement State (WebSocket)
        ↓
     FastAPI Backend
        ↓
Teacher Dashboard (Live Updates + Chart)

## Use Cases

Online classes & virtual classrooms

Proctoring & attention monitoring

EdTech platforms

AI-based behavioral analytics projects

## Why This Project?

This project demonstrates:

Real-time AI inference in the browser

WebSocket-based system design

Clean separation of Student & Teacher roles

Practical application of computer vision in education

It was built as a personal learning project to explore real-time AI systems and full-stack integration.

## Author

# Anchal Gupta
# Aspiring Data Scientist | AI & Full-Stack Enthusiast

