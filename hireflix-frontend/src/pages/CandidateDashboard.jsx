import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { fetchCandidateInterviews } from "../store/candidateSlice";

function CandidateDashboard() {
  const { user } = useSelector((state) => state.auth || {});
  const { interviews = [], loading, error } = useSelector(
    (state) => state.candidate || {}
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/"); // Redirect to login if not logged in
      return;
    }
    dispatch(fetchCandidateInterviews());
  }, [user, navigate, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto py-10 px-6">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Candidate Dashboard
        </h2>
        <p className="text-gray-600 mb-6">
          Welcome, <span className="font-semibold">{user?.name || ""}</span>
        </p>

        {/* Loading */}
        {loading && (
          <div className="p-6 bg-white rounded-lg shadow text-center text-gray-500">
            Loading interviews...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-6 bg-white rounded-lg shadow text-center text-red-500">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && interviews.length === 0 ? (
          <div className="p-6 bg-white rounded-lg shadow text-center text-gray-500">
            No assigned interviews yet.
          </div>
        ) : (
          !loading &&
          !error &&
          Array.isArray(interviews) &&
          interviews.length > 0 && (
            <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="px-6 py-3 text-sm font-semibold border border-gray-200">
                      Title
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold border border-gray-200">
                      Description
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold border border-gray-200">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {interviews.map((interview, idx) => (
                    <tr
                      key={interview?.id || idx}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-6 py-4 text-gray-700 border border-gray-200">
                        {interview?.title || ""}
                      </td>
                      <td className="px-6 py-4 text-gray-700 border border-gray-200">
                        {interview?.description || ""}
                      </td>
                      <td className="px-6 py-4 text-gray-700 border border-gray-200">
                        {interview?.id && (
                          <Link to={`/record-answers/${interview.id}`}>
                            <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow hover:bg-indigo-700 transition">
                              Record / Upload Answers
                            </button>
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default CandidateDashboard;
