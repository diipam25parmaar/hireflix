import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { createInterview, resetCreateInterviewState } from "../store/adminSlice";

function CreateInterview() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { createInterviewLoading, createInterviewError, createInterviewSuccess } = useSelector(
    (state) => state.admin
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([{ text: "", position: 1 }]);

  // modal states
  const [showModal, setShowModal] = useState(false);
  const [removeIndex, setRemoveIndex] = useState(null);

  // Alert state
  const [alert, setAlert] = useState({ visible: false, message: "", type: "success" });
  let alertTimeout;
  const showAlert = (message, type = "success") => {
    clearTimeout(alertTimeout);
    setAlert({ visible: true, message, type });
    alertTimeout = setTimeout(
      () => setAlert({ visible: false, message: "", type: "success" }),
      3000
    );
  };

  useEffect(() => {
    if (createInterviewSuccess) {
      showAlert("Interview created successfully!", "success");
      setTimeout(() => {
        dispatch(resetCreateInterviewState());
        navigate("/dashboard");
      }, 1000);
    } else if (createInterviewError) {
      showAlert(createInterviewError, "error");
      dispatch(resetCreateInterviewState());
    }
  }, [createInterviewSuccess, createInterviewError, dispatch, navigate]);

  const addQuestion = () => {
    setQuestions([...questions, { text: "", position: questions.length + 1 }]);
  };

  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    if (updated[index]) {
      updated[index].text = value;
      setQuestions(updated);
    }
  };

  const confirmRemove = (index) => {
    setRemoveIndex(index);
    setShowModal(true);
  };

  const removeQuestion = () => {
    if (removeIndex !== null && removeIndex >= 0) {
      const updated = questions.filter((_, i) => i !== removeIndex);
      const reOrdered = updated.map((q, i) => ({ ...q, position: i + 1 }));
      setQuestions(reOrdered);
    }
    setShowModal(false);
    setRemoveIndex(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createInterview({ title, description, questions }));
  };

  return (
    <div className="flex justify-center items-start min-h-screen p-10 bg-gray-100 font-inter">
      <div className="flex justify-center items-start w-full max-w-3xl">
        {/* Form Card */}
        <div className="bg-white p-8 rounded-xl w-full shadow-lg border-2 border-blue-500 text-center transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl">
          <h2 className="text-2xl font-bold mb-5 text-blue-800">Create Interview</h2>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block font-semibold mb-1 text-gray-800">Title:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full p-3 rounded-lg border border-slate-300 text-base outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-gray-800">Description:</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full p-3 rounded-lg border border-slate-300 text-base outline-none"
              />
            </div>

            <h3 className="font-bold text-lg mt-5 mb-2 text-blue-900">Questions</h3>
            {Array.isArray(questions) &&
              questions.map((q, index) => (
                <div key={index} className="flex flex-col items-start mb-4">
                  <label className="font-semibold mb-1 text-gray-800">
                    Question {index + 1}:
                  </label>
                  <input
                    type="text"
                    value={q?.text || ""}
                    onChange={(e) => handleQuestionChange(index, e.target.value)}
                    required
                    className="w-full p-3 rounded-lg border border-slate-300 text-base outline-none"
                  />
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => confirmRemove(index)}
                      className="mt-2 px-4 py-2 rounded-lg font-semibold text-white bg-red-500 hover:bg-red-600 transition"
                    >
                      ❌ Remove Question
                    </button>
                  )}
                </div>
              ))}

            <button
              type="button"
              onClick={addQuestion}
              className="px-4 py-2 rounded-lg font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
            >
              ➕ Add Question
            </button>

            <div className="mt-6 text-center">
              <button
                type="submit"
                disabled={createInterviewLoading}
                className="px-5 py-3 rounded-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 transition disabled:opacity-60"
              >
                {createInterviewLoading ? "Creating..." : "✅ Create Interview"}
              </button>
            </div>
          </form>
        </div>

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white p-6 rounded-xl border-2 border-red-500 shadow-lg max-w-md w-full text-center"
              >
                <h3 className="text-red-700 font-bold mb-3">⚠️ Confirm Removal</h3>
                <p className="text-gray-700 mb-5">
                  {removeIndex !== null
                    ? `Are you sure you want to remove Question ${removeIndex + 1}?`
                    : ""}
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={removeQuestion}
                    className="px-4 py-2 rounded-lg font-semibold text-white bg-red-500 hover:bg-red-600 transition"
                  >
                    Yes, Remove
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-lg font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Alert */}
        <AnimatePresence>
          {alert.visible && (
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className={`fixed top-4 right-4 px-4 py-3 rounded-lg font-semibold shadow-lg z-50 ${
                alert.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
              }`}
            >
              {alert.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default CreateInterview;
