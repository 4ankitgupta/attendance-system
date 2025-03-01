import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Master from "./pages/Master";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import AttendanceReports from "./pages/AttendanceReports";
import Supervisors from "./pages/Supervisors";
import AssignSupervisorWard from "./pages/AssignSupervisorWard";
import Settings from "./pages/Settings";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "./AuthContext";
import { AuthProvider } from "./AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <MainContent />
      </Router>
    </AuthProvider>
  );
}

function MainContent() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth(); // Ensure useAuth() is used inside AuthProvider

  return (
    <div className="flex">
      {user && <Sidebar />}
      <div className={`flex-1 ${user ? "ml-64" : ""} overflow-x-auto`}>
        {user && (
          <Navbar toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
        )}
        <div className="p-5">
          <Routes>
            <Route path="/login" element={<RedirectIfAuthenticated />} />
            <Route
              path="/"
              element={<ProtectedRoute element={<Dashboard />} />}
            />
            <Route
              path="/master"
              element={<ProtectedRoute element={<Master />} />}
            />
            <Route
              path="/employees"
              element={<ProtectedRoute element={<Employees />} />}
            />
            <Route
              path="/attendance"
              element={<ProtectedRoute element={<AttendanceReports />} />}
            />
            <Route
              path="/supervisors"
              element={<ProtectedRoute element={<Supervisors />} />}
            />
            <Route
              path="/assignSupervisorWard"
              element={<ProtectedRoute element={<AssignSupervisorWard />} />}
            />
            <Route
              path="/settings"
              element={<ProtectedRoute element={<Settings />} />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

// ✅ Redirect Logged-in Users Away from Login Page
const RedirectIfAuthenticated = () => {
  const { user } = useAuth();
  return user ? <Navigate to="/" replace /> : <Login />;
};

export default App;
