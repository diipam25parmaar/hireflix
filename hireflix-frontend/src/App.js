import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateInterview from "./pages/CreateInterview";
import CandidateDashboard from "./pages/CandidateDashboard";
import RecordAnswers from "./pages/RecordAnswers";
import ReviewerDashboard from "./pages/ReviewerDashboard";
import ReviewAnswers from "./pages/ReviewAnswers";
import AssignInterview from "./pages/AssignInterview";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ManageUsers from "./pages/ManageUsers";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-r from-gray-50 via-blue-50 to-gray-100">
        {/* Global Header */}
        <Header />

        {/* Main content */}
        <main className="flex-grow container mx-auto px-4 py-6">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-interview"
              element={
                <PrivateRoute>
                  <CreateInterview />
                </PrivateRoute>
              }
            />
            <Route
              path="/candidate-dashboard"
              element={
                <PrivateRoute>
                  <CandidateDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/reviewer-dashboard"
              element={
                <PrivateRoute>
                  <ReviewerDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/interview/:id"
              element={
                <PrivateRoute>
                  <RecordAnswers />
                </PrivateRoute>
              }
            />
            <Route
              path="/review/:id"
              element={
                <PrivateRoute>
                  <ReviewAnswers />
                </PrivateRoute>
              }
            />

            {/* Misc Routes */}
            <Route path="/record-answers/:interviewId" element={<RecordAnswers />} />
            <Route path="/assign-interview" element={<AssignInterview />} />
            <Route path="/manage-users" element={<ManageUsers />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
