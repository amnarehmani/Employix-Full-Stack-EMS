import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";

import Attendance from "./pages/Attendance";
import Dashboard from "./pages/Dashboard";
import Departments from "./pages/Departments";
import Employees from "./pages/Employees";
import Layout from "./pages/Layout";
import Leave from "./pages/Leave";
import LoginLanding from "./pages/LoginLanding";
import Payslips from "./pages/Payslips";
import PrintPayslip from "./pages/PrintPayslip";
import Settings from "./pages/Settings";
import Signup from "./pages/Signup";
import Tasks from "./pages/Tasks";
import LoginForm from "./components/LoginForm";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <Toaster />

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginLanding />} />
        <Route path="/login/admin" element={<LoginForm role="admin" title="Admin Portal" subtitle="Sign in to manage the organization" />} />
        <Route path="/login/employee" element={<LoginForm role="employee" title="Employee Portal" subtitle="Sign in to access your account" />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/leave" element={<Leave />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/payslips" element={<Payslips />} />
          <Route
            path="/print/payslips/:id"
            element={<PrintPayslip />}
          />
          <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute roles={["admin"]} />}>
          <Route element={<Layout />}>
            <Route path="/employees" element={<Employees />} />
            <Route path="/departments" element={<Departments />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
