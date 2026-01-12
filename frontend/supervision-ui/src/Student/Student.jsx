import { useEffect, useRef, useState } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors } from "@mediapipe/drawing_utils";
import { FACEMESH_TESSELATION } from "@mediapipe/face_mesh";

export default function Student() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const wsRef = useRef(null);
  const cameraRef = useRef(null);
  const faceMeshRef = useRef(null);

  const startedRef = useRef(false);
  const lastStateRef = useRef("");
  const lastSentRef = useRef(0);

  const [status, setStatus] = useState("Starting camera...");

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    // ---------------- WebSocket ----------------
    wsRef.current = new WebSocket("ws://localhost:8000/ws/student/demo");

    wsRef.current.onopen = () => {
      console.log("Student WebSocket connected");
    };

    wsRef.current.onerror = (e) => {
      console.error("Student WebSocket error", e);
    };

    // ---------------- FaceMesh ----------------
    faceMeshRef.current = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMeshRef.current.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMeshRef.current.onResults(onResults);

    // ---------------- Camera ----------------
    cameraRef.current = new Camera(videoRef.current, {
      width: 640,
      height: 480,
      onFrame: async () => {
        if (faceMeshRef.current) {
          await faceMeshRef.current.send({
            image: videoRef.current,
          });
        }
      },
    });

    cameraRef.current.start();

    return () => {
      // DO NOT close WebSocket here
      // Student session must persist
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
    };
  }, []);

  // ---------------- Results Handler ----------------
  function onResults(results) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = results.image.width;
    canvas.height = results.image.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

    if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
      setStatus("⚠️ No face detected");
      sendState("NO_FACE");
      return;
    }

    const landmarks = results.multiFaceLandmarks[0];

    drawConnectors(ctx, landmarks, FACEMESH_TESSELATION, {
      color: "rgba(59,130,246,0.6)",
      lineWidth: 1,
    });

    const engagement = detectEngagement(landmarks);
    sendState(engagement);

    if (engagement === "FOCUSED") setStatus("😊 You are focused");
    else if (engagement === "NEUTRAL") setStatus("😐 You seem neutral");
    else setStatus("🤔 You seem confused");
  }

  // ---------------- WebSocket Send ----------------
  function sendState(state) {
    const now = Date.now();

    if (
      state === lastStateRef.current &&
      now - lastSentRef.current < 2000
    ) {
      return;
    }

    lastStateRef.current = state;
    lastSentRef.current = now;

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          state,
          timestamp: now,
        })
      );
    }
  }

  // ---------------- Engagement Logic ----------------
  function detectEngagement(landmarks) {
    let score = 0;

    // Smile detection
    const mouthWidth = Math.abs(landmarks[61].x - landmarks[291].x);
    if (mouthWidth > 0.055) score -= 2;
    else if (mouthWidth < 0.045) score += 1;

    // Brow furrow
    const browDiff = Math.abs(landmarks[65].y - landmarks[295].y);
    if (browDiff < 0.018) score += 1;

    // Head tilt
    const headTilt = Math.abs(landmarks[1].x - 0.5);
    if (headTilt > 0.05) score += 1;

    if (score >= 2) return "CONFUSED";
    if (score <= -1) return "FOCUSED";
    return "NEUTRAL";
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Student Portal</h2>

      <div style={{ position: "relative" }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{
            width: "100%",
            transform: "scaleX(-1)",
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            transform: "scaleX(-1)",
            pointerEvents: "none",
          }}
        />
      </div>

      <p style={{ fontSize: 18, marginTop: 12 }}>{status}</p>
    </div>
  );
}
