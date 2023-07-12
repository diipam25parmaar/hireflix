import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  clearMessages,
} from "../store/manageUserSlice";
import { motion, AnimatePresence } from "framer-motion";
import DataTable from "react-data-table-component";

function ManageUsers() {
  const dispatch = useDispatch();
  const { users = [], loading = false, error = null, successMessage = null } =
    useSelector((state) => state.manageUser || {});

  const [form, setForm] = useState({
    id: null,
    name: "",
    email: "",
    role: "candidate",
    password: "",
  });

  const [searchText, setSearchText] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);

  const [confirmModal, setConfirmModal] = useState({ show: false, userId: null });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    setFilteredUsers(
      users.filter(
        (u) =>
          u.name?.toLowerCase().includes(searchText.toLowerCase()) ||
          u.email?.toLowerCase().includes(searchText.toLowerCase()) ||
          u.role?.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [searchText, users]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form?.id) {
      dispatch(updateUser(form));
    } else {
      dispatch(createUser(form));
    }
    setForm({ id: null, name: "", email: "", role: "candidate", password: "" });
  };

  const handleEdit = (user) => {
    if (!user) return;
    setForm({ ...user, password: "" });
  };

  const handleDelete = () => {
    if (confirmModal?.userId) dispatch(deleteUser(confirmModal.userId));
    setConfirmModal({ show: false, userId: null });
  };

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => (
        <div>
          <p className="font-bold text-gray-900">
            {row.name}{" "}
            <span className="font-semibold text-gray-500 text-sm">({row.role})</span>
          </p>
          <p className="text-gray-500 text-sm mt-1">{row.email}</p>
        </div>
      ),
      grow: 2,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="px-2 py-1 rounded-md text-white font-bold bg-blue-600 hover:bg-blue-700"
          >
            Edit
          </button>
          <button
            onClick={() => setConfirmModal({ show: true, userId: row.id })}
            className="px-2 py-1 rounded-md text-white font-bold bg-red-600 hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      ),
      right: true,
    },
  ];

  const customStyles = {
    table: {
      style: {
        width: "100%",
        border: "2px solid #e5e7eb", // outer border
        borderRadius: "0.75rem",     // rounded edges
        overflow: "hidden",          // keeps border neat with rounded corners
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)", // subtle shadow
      },
    },
    headRow: {
      style: {
        backgroundColor: "#f9fafb",  // light header bg
        borderBottom: "2px solid #e5e7eb",
      },
    },
    headCells: {
      style: {
        fontSize: "0.95rem",
        fontWeight: "700",
        color: "#1f2937",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
      },
    },
    rows: {
      style: {
        fontSize: "0.95rem",
        backgroundColor: "#fff",
        minHeight: "56px",
        borderBottom: "1px solid #e5e7eb",
      },
      highlightOnHoverStyle: {
        backgroundColor: "#f3f4f6",
        borderBottomColor: "#d1d5db",
        borderRadius: "0",
        transition: "all 0.2s ease-in-out",
        transform: "scale(1.01)", // slight zoom on hover
      },
    },
    pagination: {
      style: {
        borderTop: "1px solid #e5e7eb",
        backgroundColor: "#fafafa",
      },
    },
  };
  

  return (
    <div className="min-h-screen flex justify-center items-start p-8 bg-gray-100 font-sans">
      <div className="w-full max-w-4xl bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Manage Candidates & Reviewers
        </h2>

        {/* Alerts */}
        <AnimatePresence>
          {(error || successMessage) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`mb-3 px-3 py-2 rounded-md font-semibold shadow ${
                error
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                  : "bg-gradient-to-r from-green-500 to-green-600 text-white"
              }`}
              onAnimationComplete={() =>
                setTimeout(() => dispatch(clearMessages()), 2000)
              }
            >
              {error || successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confirm Delete Modal */}
        <AnimatePresence>
          {confirmModal?.show && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="w-full max-w-md bg-white p-5 rounded-xl shadow-lg border border-gray-200 text-center"
              >
                <h2 className="text-lg font-extrabold text-gray-900 mb-2">
                  Confirm Delete
                </h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Are you sure you want to delete this user? <br />
                  <span className="text-red-700 font-bold">
                    This action cannot be undone.
                  </span>
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() =>
                      setConfirmModal({ show: false, userId: null })
                    }
                    className="px-3 py-1 rounded-md font-semibold border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-3 py-1 rounded-md font-semibold bg-red-600 text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-5">
          <input
            type="text"
            placeholder="Name"
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-200"
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email || ""}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-200"
          />
          <select
            value={form.role || "candidate"}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-200"
          >
            <option value="candidate">Candidate</option>
            <option value="reviewer">Reviewer</option>
          </select>
          <input
            type="password"
            placeholder="Password"
            value={form.password || ""}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required={!form.id}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-200"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-xl font-bold text-white transition-transform duration-100 ${
              loading
                ? "bg-indigo-700 cursor-not-allowed opacity-70"
                : "bg-indigo-800 hover:-translate-y-0.5 hover:shadow-lg"
            }`}
          >
            {form?.id ? "Update User" : "Add User"}
          </button>
        </form>

        {/* Users DataTable with Search */}
        <div>
          <h3 className="text-base font-bold mb-2">Existing Users</h3>
          <DataTable
            columns={columns}
            data={filteredUsers}
            progressPending={loading}
            pagination
            highlightOnHover
            responsive
            customStyles={customStyles}
            subHeader
            subHeaderComponent={
              <input
                type="text"
                placeholder="Search by name, email or role"
                className="border border-gray-300 rounded-lg px-3 py-1 w-full max-w-xs"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            }
            noDataComponent={
              <p className="text-gray-500 text-sm">No users found.</p>
            }
          />
        </div>
      </div>
    </div>
  );
}

export default ManageUsers;
