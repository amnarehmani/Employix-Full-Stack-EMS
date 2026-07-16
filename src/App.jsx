import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";

import Attendance from "./pages/Attendance";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Layout from "./pages/Layout";
import Leave from "./pages/Leave";
import LoginLanding from "./pages/LoginLanding";
import Payslips from "./pages/Payslips";
import PrintPayslip from "./pages/PrintPayslip";
import Settings from "./pages/Settings";
import LoginForm from "./components/LoginForm";

const App = () => {
  return (
    <>
      <Toaster />

      <Routes>
        {/* Login Page */}
        <Route path="/login" element={<LoginLanding />} />
                <Route path="/login/admin" element={<LoginForm role="admin" title="Admin Portal"  subtitle="Sign in to manage the organization"/>} />
                        <Route path="/login/employee" element={<LoginForm role="employee" title="Employee Portal"  subtitle="Sign in to access your account"/>} />

        {/* Layout Routes */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/leave" element={<Leave />} />
          <Route path="/payslips" element={<Payslips />} />
          <Route
            path="/print/payslips/:id"
            element={<PrintPayslip />}
          />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
};

export default App;