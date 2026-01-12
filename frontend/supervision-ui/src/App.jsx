import { Routes, Route, Link } from "react-router-dom";
import Student from "./Student/Student";
import Teacher from "./Teacher/Teacher";

export default function App() {
  return (
    <div style={{ padding: 20 }}>
      <h1>SuperVision AI</h1>

      {/* Navigation */}
      <div style={{ marginBottom: 20 }}>
        <Link to="/student">
          <button style={{ marginRight: 10 }}>Student</button>
        </Link>
        <Link to="/teacher">
          <button>Teacher</button>
        </Link>
      </div>

      {/* Routes */}
      <Routes>
        <Route path="/student" element={<Student />} />
        <Route path="/teacher" element={<Teacher />} />
        <Route
          path="*"
          element={<p>Select Student or Teacher</p>}
        />
      </Routes>
    </div>
  );
}
