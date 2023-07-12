import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, clearAuthError } from "../store/authSlice";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (location && location.state) {
      if (location.state.email) setEmail(location.state.email);
      if (location.state.token) setToken(location.state.token);
    }
  }, [location]);

  useEffect(() => {
    if (error) {
      setMessage(error);
      dispatch(clearAuthError());
    }
  }, [error, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (password !== passwordConfirmation) {
      setMessage("Passwords do not match");
      return;
    }

    dispatch(
      resetPassword({
        email,
        token,
        password,
        password_confirmation: passwordConfirmation,
      })
    )
      .unwrap()
      .then(() => {
        setMessage("Password has been reset successfully.");
        setTimeout(() => navigate("/"), 1400);
      })
      .catch(() => {
        // error handled by Redux
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-7 bg-gradient-to-br from-indigo-600 to-blue-600 font-sans">
      <div className="w-full max-w-md bg-white rounded-xl p-7 shadow-xl text-left">
        <h2 className="text-center text-2xl font-bold text-gray-900 mb-4">
          Reset Password
        </h2>

        {message && (
          <p className="text-center text-indigo-600 font-semibold mb-3">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-gray-700 font-semibold text-sm mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold text-sm mb-1">
              Reset Token
            </label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              placeholder="Paste reset token"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold text-sm mb-1">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold text-sm mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-3 py-3 bg-indigo-700 text-white font-bold rounded-xl shadow-md ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-indigo-800"
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
