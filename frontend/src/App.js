import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Master from "./pages/Master";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import AttendanceReports from "./pages/AttendanceReports";
import Supervisors from "./pages/Supervisors";
import AssignSupervisorWard from "./pages/AssignSupervisorWard";
import Settings from "./pages/Settings";

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="ml-64 w-full flex-1 p-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/master" element={<Master />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/attendance" element={<AttendanceReports />} />
            <Route path="/supervisors" element={<Supervisors />} />
            <Route
              path="/assignSupervisorWard"
              element={<AssignSupervisorWard />}
            />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
