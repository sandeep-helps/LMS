import React, { useState } from "react";
import logo from "../assets/logo.jpg";
import axios from "axios";
import { serverUrl } from "../App";
import { MdOutlineRemoveRedEye, MdRemoveRedEye } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function Login() {
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
    <div className="bg-[#dddbdb] w-[100vw] h-[100vh] flex items-center justify-center flex-col gap-3">
      <form
        className="w-[90%] md:w-200 h-150 bg-white shadow-xl rounded-2xl flex"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* LEFT SIDE – FORM */}
        <div className="md:w-[50%] w-[100%] h-full flex flex-col items-center justify-center gap-4">
          <div className="text-center">
            <h1 className="font-semibold text-black text-2xl">
              Welcome Back
            </h1>
            <h2 className="text-[#999797] text-[18px]">
              Login to your account
            </h2>
          </div>

          {/* EMAIL */}
          <div className="flex flex-col gap-1 w-[80%] px-3">
            <label className="font-semibold">Email</label>
            <input
              type="email"
              className="border w-full h-[35px] border-[#e7e6e6] text-[15px] px-[20px]"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col gap-1 w-[80%] px-3 relative">
            <label className="font-semibold">Password</label>
            <input
              type={show ? "text" : "password"}
              className="border w-full h-[35px] border-[#e7e6e6] text-[15px] px-[20px]"
              placeholder="***********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {!show ? (
              <MdOutlineRemoveRedEye
                className="absolute w-[20px] h-[20px] cursor-pointer right-[8%] bottom-[18%]"
                onClick={() => setShow(true)}
              />
            ) : (
              <MdRemoveRedEye
                className="absolute w-[20px] h-[20px] cursor-pointer right-[8%] bottom-[18%]"
                onClick={() => setShow(false)}
              />
            )}
          </div>

          {/* FORGOT PASSWORD */}
          <div className="w-[80%] text-right text-sm text-gray-600 cursor-pointer hover:underline"
               onClick={() => navigate("/forgotpassword")}>
            Forgot password?
          </div>

          {/* BUTTON */}
          <button
            className="w-[80%] h-[40px] bg-black text-white rounded-[5px] flex items-center justify-center"
            disabled={loading}
            onClick={handleLogin}
          >
            {loading ? <ClipLoader size={25} color="white" /> : "Login"}
          </button>

          {/* FOOTER */}
          <div className="text-[#6f6f6f]">
            Don’t have an account?{" "}
            <span
              className="underline text-black cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </div>
        </div>

        {/* RIGHT SIDE – LOGO PANEL */}
        <div className="w-[50%] h-full rounded-r-2xl bg-black md:flex items-center justify-center flex-col hidden">
          <img src={logo} className="w-30 shadow-2xl" alt="logo" />
          <span className="text-white text-2xl mt-2">
            VIRTUAL COURSES
          </span>
        </div>
      </form>
    </div>
  );
}

export default Login;
