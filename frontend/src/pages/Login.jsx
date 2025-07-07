import {useEffect, useState } from "react";
import axios from "axios";
import api from "../lib/axios";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";
import { Link } from "react-router-dom";
import { toast } from 'react-hot-toast'; 

const Login = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/"); // already logged in, redirect
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      navigate("/");
      toast.success("Logged In Successfully")
    } catch (err) {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="flex items-start justify-center min-h-screen pt-20 bg-base-100">
      <form
        onSubmit={handleLogin}
        className="bg-base-200 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-primary">Login</h2>

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

        <button className="btn btn-primary w-full" type="submit">
          Login
        </button>

        <p className="text-sm text-center mt-2">
        <span className="text-base-content/70">Forgot? </span>
        <Link to="/forgot" className="text-primary hover:underline">
          Recover password or username
        </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
