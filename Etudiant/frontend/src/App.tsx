import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import RegisterPage from "./RegisterPage";
import Login from "./Login"; // Correctement fait référence à Login.tsx
import DashboardStudent from "./StudentDashboard"; 
import TeacherDashboard from "./TeacherDashboard";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<Login />} /> {/* Pointé vers Login.tsx */}
        <Route path="/student-dashboard" element={<DashboardStudent />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
