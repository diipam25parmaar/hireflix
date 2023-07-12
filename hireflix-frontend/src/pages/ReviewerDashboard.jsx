import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchInterviews } from "../store/reviewerSlice";

function ReviewerDashboard() {
  const { user } = useSelector((state) => state.auth);
  const { interviews, loading, error } = useSelector((state) => state.reviewer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/"); // redirect if not logged in
      return;
    }
    dispatch(fetchInterviews());
  }, [user, navigate, dispatch]);

  return (
    <div className="min-h-screen bg-[#f7f9fc] flex justify-center items-start p-8 font-['Inter']">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Reviewer Dashboard</h2>
        <p className="text-base text-gray-600 mb-6">
          Welcome, {user?.name || "Reviewer"}
        </p>

        {loading ? (
          <p className="text-gray-500 italic">Loading interviews...</p>
        ) : error ? (
          <p className="text-red-600 font-medium">{error}</p>
        ) : !interviews || interviews.length === 0 ? (
          <p className="text-gray-500 italic">No interviews available.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {interviews.map((interview) => (
              <li
                key={interview?.id || Math.random()}
                className="p-4 bg-gray-100 rounded-lg transition-all duration-200 hover:bg-gray-200"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                      {interview?.title || "Untitled Interview"}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {interview?.description || "No description available"}
                    </p>
                  </div>
                  <Link to={`/review/${interview?.id}`} className="shrink-0">
                    <button className="px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition-colors">
                      View Submissions
                    </button>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ReviewerDashboard;
