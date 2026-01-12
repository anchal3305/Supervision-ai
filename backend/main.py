import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect

app = FastAPI()

teachers: list[WebSocket] = []


@app.get("/")
def root():
    return {"status": "Backend running"}


# ---------------- STUDENT ----------------
@app.websocket("/ws/student/{student_id}")
async def student_ws(websocket: WebSocket, student_id: str):
    await websocket.accept()
    print(f"Student connected: {student_id}")

    try:
        while True:
            message = await websocket.receive_text()
            print("From student:", message)
            print("Teachers connected:", len(teachers))

            dead = []

            for teacher in teachers:
                try:
                    await teacher.send_text(message)
                except Exception as e:
                    print("Removing dead teacher:", e)
                    dead.append(teacher)

            for d in dead:
                teachers.remove(d)

    except WebSocketDisconnect:
        print(f"Student disconnected: {student_id}")


# ---------------- TEACHER ----------------
@app.websocket("/ws/teacher/{teacher_id}")
async def teacher_ws(websocket: WebSocket, teacher_id: str):
    await websocket.accept()
    teachers.append(websocket)
    print(f"Teacher connected: {teacher_id}")
    print("Total teachers:", len(teachers))

    try:
        while True:
            # Keep alive, DO NOT wait for input
            await asyncio.sleep(1)

    except WebSocketDisconnect:
        print(f"Teacher disconnected: {teacher_id}")
        if websocket in teachers:
            teachers.remove(websocket)

