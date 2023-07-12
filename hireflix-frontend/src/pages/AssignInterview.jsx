import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInterviews,
  assignInterview,
  fetchAssignedInterviews,
} from "../store/interviewsSlice";
import { fetchCandidates } from "../store/adminSlice";
import { motion, AnimatePresence } from "framer-motion";
import Select from "react-select";

function AssignInterview() {
  const dispatch = useDispatch();

  const {
    list: interviews = [],
    assigned: assignedInterviews = [],
    loading: interviewsLoading,
    error: interviewsError,
  } = useSelector((state) => state.interviews || {});
  const {
    candidates = [],
    loading: candidatesLoading,
    error: candidatesError,
  } = useSelector((state) => state.admin || {});

  const [selectedInterview, setSelectedInterview] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    if (dispatch) {
      dispatch(fetchInterviews());
      dispatch(fetchCandidates());
      dispatch(fetchAssignedInterviews());
    }
  }, [dispatch]);

  const handleAssign = async () => {
    if (!selectedInterview || !selectedCandidate) return;

    const alreadyAssigned =
      Array.isArray(assignedInterviews) &&
      assignedInterviews.find(
        (a) =>
          a?.id === parseInt(selectedInterview) &&
          Array.isArray(a?.candidates) &&
          a.candidates.some((u) => u?.id === parseInt(selectedCandidate))
      );

    if (alreadyAssigned) {
      setShowAlert({
        visible: true,
        message: "Interview is already assigned to this candidate.",
        type: "error",
      });
      setShowModal(false);
      setTimeout(
        () => setShowAlert({ visible: false, message: "", type: "success" }),
        2000
      );
      return;
    }

    setAssigning(true);
    try {
      await dispatch(
        assignInterview({ interviewId: selectedInterview, userIds: [selectedCandidate] })
      ).unwrap();
      setAssigning(false);
      setShowModal(false);

      if (dispatch) dispatch(fetchAssignedInterviews());

      setShowAlert({
        visible: true,
        message: "Interview assigned successfully!",
        type: "success",
      });
      setTimeout(
        () => setShowAlert({ visible: false, message: "", type: "success" }),
        2000
      );
    } catch (err) {
      console.error(err);
      setAssigning(false);
      setShowAlert({
        visible: true,
        message: "Failed to assign interview.",
        type: "error",
      });
      setTimeout(
        () => setShowAlert({ visible: false, message: "", type: "success" }),
        2000
      );
    }
  };

  const confirmAssign = (e) => {
    e.preventDefault();
    if (!selectedInterview || !selectedCandidate) {
      setShowAlert({
        visible: true,
        message: "Please select both interview and candidate.",
        type: "error",
      });
      setTimeout(
        () => setShowAlert({ visible: false, message: "", type: "success" }),
        2000
      );
      return;
    }
    setShowModal(true);
  };

  if (interviewsLoading || candidatesLoading) return <p>Loading...</p>;
  if (interviewsError) return <p>Error loading interviews: {interviewsError}</p>;
  if (candidatesError) return <p>Error loading candidates: {candidatesError}</p>;

  // react-select options
  const interviewOptions = Array.isArray(interviews)
    ? interviews.map((i) => ({
        value: i?.id,
        label: i?.title || "Untitled",
      }))
    : [];

  const candidateOptions = Array.isArray(candidates)
    ? candidates.map((c) => ({
        value: c?.id,
        label: `${c?.name || "No Name"} (${c?.email || "No Email"})`,
      }))
    : [];

  // react-select styles (fixed border/outline issue)
  const customStyles = {
    control: (base) => ({
      ...base,
      border: "none",            // no border
      boxShadow: "none",         // no shadow
      outline: "none",           // no outline
      backgroundColor: "#fff",
      borderRadius: "0.5rem",
      padding: "2px",
      "&:hover": { border: "none" },
    }),
    input: (base) => ({
      ...base,
      boxShadow: "none !important",  // kill blue glow
      outline: "none !important",    // kill outline
      border: "none !important",     // kill border
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#e0f2fe" : "white",
      color: "#1e293b",
      cursor: "pointer",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "#3b82f6",
      "&:hover": { color: "#2563eb" },
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
  };
  
  return (
    <div className="flex justify-center items-start min-h-screen bg-[#f0f4f8] p-5 sm:p-10 font-['Inter',sans-serif]">
      <div className="bg-white w-full max-w-[600px] p-8 sm:p-10 rounded-xl shadow-lg border-2 border-blue-500 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl">
        <h2 className="text-center mb-8 text-blue-900 text-[1.8rem] font-bold">
          Assign Interview to Candidate
        </h2>

        {/* Form */}
        <form onSubmit={confirmAssign}>
          <div className="flex flex-col mb-5 w-full">
            <label className="mb-2 font-semibold text-gray-800">
              Select Interview:
            </label>
            <Select
              options={interviewOptions}
              value={
                interviewOptions.find((o) => o.value === parseInt(selectedInterview)) ||
                null
              }
              onChange={(option) => setSelectedInterview(option?.value || "")}
              isSearchable
              placeholder="--Select Interview--"
              menuPlacement="bottom"
              styles={customStyles}
            />
          </div>

          <div className="flex flex-col mb-5 w-full">
            <label className="mb-2 font-semibold text-gray-800">
              Select Candidate:
            </label>
            <Select
              options={candidateOptions}
              value={
                candidateOptions.find((o) => o.value === parseInt(selectedCandidate)) ||
                null
              }
              onChange={(option) => setSelectedCandidate(option?.value || "")}
              isSearchable
              placeholder="--Select Candidate--"
              menuPlacement="bottom"
              styles={customStyles}
            />
          </div>

          <button
            type="submit"
            disabled={assigning}
            className="w-full py-3 bg-blue-500 text-white text-base font-semibold rounded-lg transition-all duration-200 hover:bg-blue-600 disabled:bg-indigo-300 disabled:cursor-not-allowed mt-4"
          >
            {assigning ? "Assigning..." : "Assign Interview"}
          </button>
        </form>

        {/* Assigned Interviews */}
        <div className="mt-8">
          <h3 className="mb-4 text-center font-bold text-lg">Assigned Interviews</h3>
          {!Array.isArray(assignedInterviews) || assignedInterviews.length === 0 ? (
            <p>No interviews assigned yet.</p>
          ) : (
            <table className="w-full border-collapse mt-3 font-['Inter',sans-serif]">
              <thead>
                <tr>
                  <th className="bg-blue-500 text-white font-semibold px-4 py-3 border border-gray-300 text-left">
                    Interview Title
                  </th>
                  <th className="bg-blue-500 text-white font-semibold px-4 py-3 border border-gray-300 text-left">
                    Assigned Candidates
                  </th>
                </tr>
              </thead>
              <tbody>
                {assignedInterviews.map((interview) => (
                  <tr
                    key={interview?.id}
                    className="even:bg-gray-50 hover:bg-sky-100"
                  >
                    <td className="px-4 py-3 border border-gray-300 text-gray-800">
                      {interview?.title || "Untitled"}
                    </td>
                    <td className="px-4 py-3 border border-gray-300 text-gray-800">
                      {Array.isArray(interview?.candidates) &&
                      interview.candidates.length > 0
                        ? interview.candidates
                            .map(
                              (u) =>
                                `${u?.name || "No Name"} (${u?.email || "No Email"})`
                            )
                            .join(", ")
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl shadow-2xl max-w-[500px] w-full p-6 border border-gray-300"
            >
              <h3 className="text-lg font-bold text-gray-800 text-center">
                ⚠️ Confirm Assignment
              </h3>
              <p className="text-center text-gray-700 mt-3">
                Are you sure you want to assign this interview to the selected candidate?
              </p>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={handleAssign}
                  disabled={assigning}
                  className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-800 transition-all"
                >
                  {assigning ? "Assigning..." : "Yes, Assign"}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alerts */}
      <AnimatePresence>
        {showAlert.visible && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg font-medium z-50 ${
              showAlert.type === "success"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {showAlert.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AssignInterview;
