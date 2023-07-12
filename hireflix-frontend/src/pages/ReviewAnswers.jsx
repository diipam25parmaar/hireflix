import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

import {
  fetchSubmissions,
  submitReview,
  deleteInterview,
  setReviewData,
  clearMessages
} from "../store/reviewAnswersSlice";

function DeleteInterviewButton({ interviewId, onDeleted }) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { deleting } = useSelector(state => state.reviewAnswers);
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await dispatch(deleteInterview(interviewId)).unwrap();
      setOpen(false);
      onDeleted?.();
      setTimeout(() => navigate("/reviewer-dashboard"), 2000);
    } catch (err) {
      alert(err);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-red-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-red-600 transition"
      >
        Delete Interview
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl p-6 w-full max-w-md border border-gray-200 shadow-md"
            >
              <h2 className="text-center text-lg font-bold text-gray-700">
                Confirm Delete
              </h2>
              <p className="text-center text-gray-500 mt-2">
                Are you sure you want to delete this interview? <br />
                <span className="text-red-700 font-bold">
                  This action can be undone only by restoring from the backend.
                </span>
              </p>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className={`px-4 py-2 rounded-md bg-red-600 text-white font-semibold transition ${
                    deleting ? "opacity-70 cursor-not-allowed" : "hover:bg-red-700"
                  }`}
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ReviewAnswers() {
  const { id } = useParams();
  const { user } = useSelector(state => state.auth) || {};
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    submissions = [],
    reviewData = {},
    loading,
    submittingReview,
    error,
    successMessage
  } = useSelector(state => state.reviewAnswers) || {};

  const isReviewer = user?.role === "reviewer";

  useEffect(() => {
    if (id) dispatch(fetchSubmissions(id));
  }, [id, dispatch]);

  const handleReviewSubmit = (answerId, score, comment) => {
    if (score === "" || score < 0 || score > 10) {
      alert("Score must be between 0 and 10");
      return;
    }
    dispatch(submitReview({ answerId, score, comment })).then(() => {
      setTimeout(() => dispatch(clearMessages()), 2500);
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-8 font-sans">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-8">
        <div className="bg-blue-600 text-center rounded-lg py-4 mb-6">
          <h2 className="text-white text-2xl font-bold">
            Submissions for Interview {id}
          </h2>
        </div>

        {loading ? (
          <p className="text-gray-600 text-center">Loading submissions...</p>
        ) : submissions.length === 0 ? (
          <p className="text-gray-600 text-center">No submissions yet</p>
        ) : (
          <div className="space-y-6">
            {submissions.map(sub => (
              <div key={sub?.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50 hover:border-blue-400 hover:shadow-md transition">
                <div className="border-b border-gray-300 pb-2 mb-4">
                  <p className="text-gray-600">
                    <span className="font-bold text-gray-800">Candidate:</span>{" "}
                    {sub?.candidate?.name ?? "N/A"} ({sub?.candidate?.email ?? "N/A"})
                  </p>
                </div>

                {sub?.answers?.map(ans => {
                  if (!ans) return null;
                  const score = reviewData[ans.id]?.score ?? "";
                  const comment = reviewData[ans.id]?.comment ?? "";
                  const reviewSubmitted = ans?.score !== null && ans?.score !== undefined;

                  return (
                    <div key={ans.id} className="border border-gray-200 rounded-md p-4 mb-4 bg-white hover:shadow-sm hover:border-blue-300 transition">
                      <div className="border-b border-gray-200 pb-2 mb-2">
                        <p className="text-gray-600"><span className="font-bold text-gray-800">Question:</span> {ans?.question?.text ?? "N/A"}</p>
                        <p className="text-gray-600">
                          <span className="font-bold text-gray-800">File:</span>{" "}
                          {ans?.file_path ? (
                            <video controls src={ans.file_path} className="w-[30%] h-[30%] rounded-md shadow-md" />
                          ) : (
                            <span className="italic text-gray-400">No file</span>
                          )}
                        </p>
                        <p className="text-gray-600"><span className="font-bold text-gray-800">Duration:</span> {ans?.duration_seconds ?? "N/A"}s</p>
                        <p className="text-gray-600"><span className="font-bold text-gray-800">Score:</span> {ans?.score ?? <span className="italic text-gray-400">Not reviewed yet</span>}</p>
                        <p className="text-gray-600"><span className="font-bold text-gray-800">Review Comment:</span> {ans?.review_comment ?? <span className="italic text-gray-400">No comment</span>}</p>
                        {ans?.reviewer?.name && (
                          <p className="text-gray-600"><span className="font-bold text-gray-800">Reviewed by:</span> {ans?.reviewer?.name} ({ans?.reviewer?.email})</p>
                        )}
                      </div>

                      {isReviewer && (
                        <div className={`mt-3 p-3 rounded-md bg-gray-100 ${reviewSubmitted ? 'bg-gray-200' : 'hover:bg-blue-50'} transition`}>
                          <label className="font-semibold text-gray-800 block mb-1">Score (0-10):</label>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={score}
                            onChange={e =>
                              dispatch(setReviewData({ ...reviewData, [ans.id]: { ...reviewData[ans.id], score: e.target.value } }))
                            }
                            disabled={reviewSubmitted}
                            className="w-full p-2 rounded-md border border-gray-300 mb-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <label className="font-semibold text-gray-800 block mb-1">Review Comment:</label>
                          <textarea
                            value={comment}
                            onChange={e =>
                              dispatch(setReviewData({ ...reviewData, [ans.id]: { ...reviewData[ans.id], comment: e.target.value } }))
                            }
                            disabled={reviewSubmitted}
                            className="w-full p-2 rounded-md border border-gray-300 mb-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <button
                            onClick={() => handleReviewSubmit(ans.id, score, comment)}
                            disabled={reviewSubmitted || submittingReview}
                            className={`mt-2 px-4 py-2 rounded-md font-semibold transition ${
                              reviewSubmitted || submittingReview
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                          >
                            {submittingReview ? "Submitting..." : "Submit Review"}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {user?.role === "admin" && (
          <div className="flex justify-end mt-6">
            <DeleteInterviewButton interviewId={id} onDeleted={() => {}} />
          </div>
        )}

        <AnimatePresence>
          {(error || successMessage) && (
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className={`fixed top-4 right-4 px-4 py-2 rounded-md shadow-md z-50 ${
                error ? "bg-red-500 text-white" : "bg-green-600 text-white"
              }`}
            >
              {error || successMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ReviewAnswers;
