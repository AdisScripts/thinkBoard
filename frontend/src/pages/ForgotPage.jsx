// src/pages/ForgotPage.jsx
import { useState } from "react";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // Add this

const ForgotPage = () => {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const navigate = useNavigate(); //Initialize here

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");
    setSending(true);
    try {
      await api.post("/auth/forgot", { email });
      toast.success("Reset link sent to your email!");
      setEmail("");
    } catch (err) {
      toast.error(err.response?.data?.error || "Error sending email");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex items-start justify-center min-h-screen pt-20 bg-base-100">
      <form
        onSubmit={handleSubmit}
        className="bg-base-200 p-6 rounded-lg shadow-lg w-full max-w-sm space-y-4"
      >
        <h2 className="text-xl font-bold text-center text-primary">Recover Credentials</h2>
        <input
          type="email"
          className="input input-bordered w-full"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary w-full" disabled={sending}>
          {sending ? "Sending..." : "Send Reset Link"}
        </button>

        {/*Back button */}
        <button
          type="button"
          className="btn btn-outline w-full"
          onClick={() => navigate("/login")}
        >
          Back to Login
        </button>
      </form>
    </div>
  );
};

export default ForgotPage;
