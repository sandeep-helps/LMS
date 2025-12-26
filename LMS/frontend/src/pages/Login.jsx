import React, { useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      toast.success("Login Successfully");
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl grid md:grid-cols-2 overflow-hidden">
        {/* LEFT – FORM */}
        <div className="flex flex-col justify-center px-8 py-12 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-black">Welcome Back</h1>
            <p className="text-gray-500 mt-1">Sign in to continue learning</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-11 rounded-lg border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="flex flex-col gap-2 relative">
            <label className="text-sm font-semibold">Password</label>
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11 rounded-lg border border-gray-300 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-4 top-[38px] text-gray-600"
            >
              {show ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
            </button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span
              className="text-gray-600 cursor-pointer hover:underline"
              onClick={() => navigate("/forgotpassword")}
            >
              Forgot password?
            </span>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="h-11 bg-black text-white rounded-lg font-semibold flex items-center justify-center hover:bg-zinc-800 transition"
          >
            {loading ? <ClipLoader size={22} color="white" /> : "Login"}
          </button>

          <p className="text-sm text-center text-gray-600">
            Don’t have an account?{" "}
            <span
              className="text-black font-semibold cursor-pointer hover:underline"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </span>
          </p>
        </div>

        {/* RIGHT – BRAND PANEL */}
        <div className="hidden md:flex flex-col items-center justify-center bg-black text-white p-10">
          <h2 className="text-4xl font-bold tracking-wide">VIRTUAL</h2>
          <h3 className="text-2xl mt-1 tracking-widest">COURSES</h3>
          <p className="text-gray-400 text-center mt-6 max-w-xs">
            Learn anywhere, anytime with premium virtual courses designed for your success.
          </p>
        </div>
      </div>
    </div>
  );
}
