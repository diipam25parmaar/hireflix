import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../store/authSlice";

function ForgotPassword() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setToken(null);
    setCopied(false);

    try {
      const res = await dispatch(forgotPassword({ email })).unwrap();
      setMessage(res?.message || "Reset instructions sent.");
      if (res?.token) setToken(res.token);
    } catch (err) {
      setMessage(err?.message || err?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!token) return;
    try {
      if (!navigator?.clipboard?.writeText) return;
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const goToReset = () => {
    navigate("/reset-password", { state: { email, token } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-7 bg-gradient-to-br from-indigo-600 to-blue-600 font-sans">
      <div className="w-full max-w-md bg-white rounded-xl p-7 shadow-[0_12px_30px_rgba(2,6,23,0.2)]">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
          Forgot Password
        </h2>

        {message && (
          <p className="text-center text-indigo-700 font-semibold mb-3">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-gray-700 font-semibold mb-1 text-sm">
              Enter your email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-2 py-2 rounded-xl font-semibold text-white ${
              loading ? "bg-indigo-700 cursor-not-allowed opacity-70" : "bg-indigo-800"
            }`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {token && (
          <div className="mt-4 p-4 rounded-lg bg-gray-50 border border-blue-100">
            <p className="font-bold text-gray-900 text-sm mb-2">
              Offline reset token (copy & paste into Reset screen)
            </p>

            <div className="flex flex-col md:flex-row gap-3 items-start">
              <pre className="flex-1 bg-white p-2 rounded-lg border border-blue-100 text-xs overflow-x-auto max-h-40 break-all whitespace-pre-wrap">
                {token}
              </pre>

              <div className="flex gap-2 md:flex-col md:gap-2 min-w-[110px]">
                <button
                  onClick={handleCopy}
                  type="button"
                  className="px-2 py-1 rounded-lg bg-indigo-800 text-white text-sm"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>

                <button
                  onClick={goToReset}
                  type="button"
                  className="px-2 py-1 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm"
                >
                  Use in Reset
                </button>
              </div>
            </div>

            <p className="mt-2 text-gray-500 text-xs">
              Note: the token is shown only in offline/dev mode. In production tokens should be emailed and not returned in responses.
            </p>
          </div>
        )}

        <div className="text-center mt-4">
          <button
            onClick={() => navigate("/reset-password")}
            type="button"
            className="text-white underline font-semibold px-2 py-1 rounded hover:text-black hover:bg-gray-100 transition-colors"
          >
            Already have a token? Reset Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
