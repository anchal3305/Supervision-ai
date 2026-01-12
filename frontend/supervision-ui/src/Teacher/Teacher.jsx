import { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

export default function Teacher() {
  const wsRef = useRef(null);

  const [connected, setConnected] = useState(false);
  const [currentState, setCurrentState] = useState("WAITING");
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    wsRef.current = new WebSocket("ws://localhost:8000/ws/teacher/demo");

    wsRef.current.onopen = () => setConnected(true);

    wsRef.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (!data.state) return;

      setCurrentState(data.state);
      setTimeline((prev) => [...prev, data.state].slice(-30));
    };

    wsRef.current.onclose = () => setConnected(false);

    return () => wsRef.current?.close();
  }, []);

  // Gradient based on state
  const gradient =
    currentState === "FOCUSED"
      ? "linear-gradient(135deg, #22c55e, #16a34a)"
      : currentState === "NEUTRAL"
      ? "linear-gradient(135deg, #3b82f6, #2563eb)"
      : currentState === "CONFUSED"
      ? "linear-gradient(135deg, #f59e0b, #d97706)"
      : "linear-gradient(135deg, #9ca3af, #6b7280)";

  const chartData = {
    labels: timeline.map((_, i) => i + 1),
    datasets: [
      {
        label: "Engagement",
        data: timeline.map((s) =>
          s === "FOCUSED" ? 1 : s === "NEUTRAL" ? 0.6 : 0.3
        ),
        borderWidth: 3,
        tension: 0.4,
      },
    ],
  };

  return (
    // Page wrapper (scrollable)
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f7fb",
        padding: "60px 20px",
      }}
    >
      {/* Centered container */}
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
        }}
      >
        <h1 style={{ marginBottom: 10 }}>Teacher Dashboard</h1>

        <p style={{ marginBottom: 20 }}>
          WebSocket Status:{" "}
          <strong>{connected ? "Connected" : "Disconnected"}</strong>
        </p>

        {/* Gradient Status Card */}
        <div
          style={{
            background: gradient,
            color: "white",
            padding: 32,
            borderRadius: 20,
            marginBottom: 32,
            boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
          }}
        >
          <p style={{ opacity: 0.9 }}>Current Student State</p>
          <h2 style={{ fontSize: 36, marginTop: 8 }}>
            {currentState === "WAITING"
              ? "Waiting for student…"
              : currentState}
          </h2>
        </div>

        {/* Timeline (scrolls naturally) */}
        <div
          style={{
            background: "white",
            padding: 24,
            borderRadius: 20,
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <h3 style={{ marginBottom: 12 }}>Engagement Timeline</h3>

          {timeline.length === 0 ? (
            <p>No data yet</p>
          ) : (
            <Line data={chartData} />
          )}
        </div>
      </div>
    </div>
  );
}
