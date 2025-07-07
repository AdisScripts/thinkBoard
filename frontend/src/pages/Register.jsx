import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";
import PasswordInput from "../components/PasswordInput";
import toast from "react-hot-toast";

const Register = () => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [registering, setRegistering] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleSendOtp = async () => {
    if (!email) return toast.error("Please enter your email");

    setSendingOtp(true);
    try {
      await api.post("/auth/send-otp", { email });
      setOtpSent(true);
      toast.success("OTP sent to your email");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!otp || !username || !password || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setRegistering(true);
    try {
      await api.post("/auth/register", {
        email,
        otp,
        username,
        password,
      });
      toast.success("Registration successful. Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="flex items-start justify-center min-h-screen pt-20 bg-base-100">
      <form
        onSubmit={handleRegister}
        className="bg-base-200 p-8 rounded-lg shadow-lg w-full max-w-sm space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-primary">Register</h2>

        <input
          className="input input-bordered w-full"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={otpSent}
        />

        {!otpSent ? (
          <button
            type="button"
            className="btn btn-primary w-full"
            onClick={handleSendOtp}
            disabled={sendingOtp}
          >
            {sendingOtp ? "Sending OTP..." : "Send OTP"}
          </button>
        ) : (
          <>
            <input
              className="input input-bordered w-full"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />

            <input
              className="input input-bordered w-full"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <PasswordInput
              placeholder="Password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <PasswordInput
              placeholder="Confirm Password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              className="btn btn-primary w-full"
              type="submit"
              disabled={registering}
            >
              {registering ? "Registering..." : "Register"}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default Register;
