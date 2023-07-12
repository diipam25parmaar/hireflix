import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth || {});

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-5">
        <div className="bg-white p-7 rounded-xl shadow-lg max-w-md w-full border-2 border-blue-600 text-center transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Dashboard</h2>
          <p>
            Please <Link to="/" className="text-blue-600 underline">login</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-5">
      <div className="bg-white p-7 rounded-xl shadow-lg max-w-lg w-full border-2 border-blue-600 transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl">
        {/* Header */}
        <div className="p-4 rounded-lg mb-5 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-100">
          <h2 className="text-xl md:text-2xl font-bold mb-2 text-gray-900">Dashboard</h2>
          <div className="text-gray-900 text-sm md:text-base">
            <p>
              Welcome, <strong>{user?.name || ""}</strong>
            </p>
            <p>
              Role: <span className="font-bold text-blue-600">{user?.role || ""}</span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {user?.role === "admin" && (
            <>
              <Link
                to="/create-interview"
                className="w-full text-center px-4 py-3 rounded-lg font-semibold text-white bg-blue-600 border border-blue-100 transition-transform duration-150 hover:bg-blue-800 hover:-translate-y-0.5"
              >
                ➕ Create New Interview
              </Link>
              <Link
                to="/assign-interview"
                className="w-full text-center px-4 py-3 rounded-lg font-semibold text-white bg-blue-600 border border-blue-100 transition-transform duration-150 hover:bg-blue-800 hover:-translate-y-0.5"
              >
                📝 Assign Interview
              </Link>
              <Link
                to="/reviewer-dashboard"
                className="w-full text-center px-4 py-3 rounded-lg font-semibold text-white bg-blue-600 border border-blue-100 transition-transform duration-150 hover:bg-blue-800 hover:-translate-y-0.5"
              >
                📂 View Candidate Submissions
              </Link>
              <Link
                to="/manage-users"
                className="w-full text-center px-4 py-3 rounded-lg font-semibold text-white bg-blue-600 border border-blue-100 transition-transform duration-150 hover:bg-blue-800 hover:-translate-y-0.5"
              >
                👥 Manage Candidates & Reviewers
              </Link>
            </>
          )}

          {user?.role === "reviewer" && (
            <Link
              to="/reviewer-dashboard"
              className="w-full text-center px-4 py-3 rounded-lg font-semibold text-white bg-blue-600 border border-blue-100 transition-transform duration-150 hover:bg-blue-800 hover:-translate-y-0.5"
            >
              📂 View Candidate Submissions
            </Link>
          )}

          {user?.role === "candidate" && (
            <Link
              to="/candidate-dashboard"
              className="w-full text-center px-4 py-3 rounded-lg font-semibold text-white bg-blue-600 border border-blue-100 transition-transform duration-150 hover:bg-blue-800 hover:-translate-y-0.5"
            >
              🎤 My Interviews
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="w-full text-center px-4 py-3 rounded-lg font-semibold text-white bg-red-600 border border-red-100 transition-transform duration-150 hover:bg-red-800 hover:-translate-y-0.5"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;