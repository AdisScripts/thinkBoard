// src/pages/ResetPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../lib/axios";
import toast from "react-hot-toast";

const ResetPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/auth/reset/${token}`, {
        newUsername: newUsername.trim() || undefined,
        newPassword: newPassword.trim() || undefined,
      });
      toast.success("Credentials updated successfully!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.error || "Reset failed");
    }
  };

  return (
    <div className="flex items-start justify-center min-h-screen pt-20 bg-base-100">
      <form
        onSubmit={handleReset}
        className="bg-base-200 p-6 rounded-lg shadow-lg w-full max-w-sm space-y-4"
      >
        <h2 className="text-xl font-bold text-center text-primary">Reset Info</h2>

        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="New username (optional)"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />

        <input
          type="password"
          className="input input-bordered w-full"
          placeholder="New password (optional)"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button type="submit" className="btn btn-primary w-full">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ResetPage;
