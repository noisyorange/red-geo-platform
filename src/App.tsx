import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Onboarding from "@/pages/admin/Onboarding";
import Upload from "@/pages/admin/Upload";
import Dashboard from "@/pages/Dashboard";
import ProjectDetail from "@/pages/admin/ProjectDetail";
import DataUpload from "@/pages/admin/DataUpload";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/upload" element={<Upload />} />
        <Route path="/admin/project/:id" element={<ProjectDetail />} />
        <Route path="/admin/project/:id/upload" element={<DataUpload />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/project/apply" element={<Onboarding />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
