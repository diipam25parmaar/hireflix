import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../store/authSlice";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user = null, loading = false, error = null } = useSelector(
    (state) => state.auth || {}
  );

  useEffect(() => {
    if (user) {
      if (user.role === "admin" || user.role === "reviewer") {
        navigate("/dashboard");
      } else if (user.role === "candidate") {
        navigate("/candidate-dashboard");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-7 bg-gradient-to-br from-indigo-600 to-blue-600 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl p-7 shadow-[0_12px_30px_rgba(2,6,23,0.12)] text-left">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
          HireFlix Login
        </h2>

        {error && (
          <p className="text-center text-red-600 font-semibold mb-3 text-sm">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-gray-700 font-semibold mb-1 text-sm">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1 text-sm">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
            />
            <div className="text-right mt-2">
              <Link
                to="/forgot-password"
                className="text-indigo-800 font-semibold text-sm hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-3 py-2 rounded-xl font-bold text-white shadow-[0_6px_16px_rgba(67,56,202,0.18)] ${
              loading ? "bg-indigo-700 cursor-not-allowed opacity-70" : "bg-indigo-800"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-5 text-gray-500 text-sm">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-800 font-bold hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
