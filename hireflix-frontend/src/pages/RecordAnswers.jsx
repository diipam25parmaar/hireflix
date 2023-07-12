import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInterviewQuestions,
  submitAnswers,
  setAnswer,
  clearMessages,
} from "../store/recordAnswersSlice";

function RecordAnswers() {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { questions = [], answers = {}, loading, submitting, error, successMessage } =
    useSelector((state) => state.recordAnswers || {});

  useEffect(() => {
    // Clear previous answers and messages on mount
    dispatch(clearMessages());
    Object.keys(answers).forEach((id) => dispatch(setAnswer({ questionId: id, data: null })));

    if (interviewId) {
      dispatch(fetchInterviewQuestions(interviewId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewId, dispatch]);

  const handleFileChange = (questionId, file) => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    const video = document.createElement("video");

    video.preload = "metadata";
    video.src = url;

    video.onloadedmetadata = () => {
      const duration = Math.floor(video.duration || 0);
      dispatch(setAnswer({ questionId, data: { file, duration } }));
      URL.revokeObjectURL(url);
    };
  };

  const handleSubmit = () => {
    if (!Array.isArray(questions) || questions.length === 0) return;

    for (const q of questions) {
      if (!answers[q?.id]) {
        dispatch(setAnswer({ questionId: null, data: null }));
        return alert(`Please upload video for: ${q?.text || "a question"}`);
      }
    }

    dispatch(submitAnswers({ interviewId, answers })).then((res) => {
      if (res?.meta?.requestStatus === "fulfilled") {
        setTimeout(() => {
          dispatch(clearMessages());
          navigate("/candidate-dashboard");
        }, 2000);
      } else {
        setTimeout(() => dispatch(clearMessages()), 2500);
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-indigo-600 mb-8 text-center">
        Record / Upload Answers
      </h2>

      <div className="flex flex-col gap-6">
        {Array.isArray(questions) &&
          questions.map((q, idx) => (
            <div
              key={q?.id || idx}
              className="p-5 border border-gray-300 rounded-xl bg-gray-50 hover:shadow-lg transition-shadow"
            >
              <p className="font-semibold text-gray-800 mb-3">
                Question {idx + 1}:{" "}
                <span className="font-normal text-gray-600">{q?.text}</span>
              </p>

              <label className="inline-block bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold px-5 py-2 rounded-lg cursor-pointer hover:opacity-90 transition-opacity">
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files?.length &&
                    handleFileChange(q?.id, e.target.files[0])
                  }
                />
                Upload Video
              </label>

              {answers[q?.id] && (
                <p className="mt-3 text-green-600 font-semibold">
                  ✅ Uploaded:{" "}
                  <span className="font-bold">{answers[q.id]?.file?.name}</span>{" "}
                  ({answers[q.id]?.duration}s)
                </p>
              )}
            </div>
          ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!!submitting}
        className={`mt-8 w-full py-3 font-semibold rounded-lg shadow-md text-white bg-gradient-to-r from-indigo-600 to-blue-600 transition-all ${
          submitting ? "bg-gray-400 cursor-not-allowed opacity-70" : "hover:opacity-90 hover:-translate-y-0.5"
        }`}
      >
        {submitting ? "Submitting..." : "Submit Answers"}
      </button>

      <AnimatePresence>
        {(error || successMessage) && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className={`fixed top-4 right-4 px-4 py-2 rounded-lg font-medium shadow-lg z-50 ${
              successMessage ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            {error || successMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default RecordAnswers;
