import React, { useState } from "react";
import logo from "../assets/logo.jpg";
import { IoMdPerson } from "react-icons/io";
import { GiHamburgerMenu, GiSplitCross } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";

function Nav() {
  const [showHam, setShowHam] = useState(false);
  const [showPro, setShowPro] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      toast.success("Logout successful");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed", error);
    }
  };

  return (
    <>
      {/* NAV BAR */}
      <nav className="w-full h-[70px] fixed top-0 px-5 py-2 flex items-center justify-between bg-[#00000047] z-50">
        {/* LOGO */}
        <img
          src={logo}
          alt="Logo"
          className="w-[60px] rounded-md border-2 border-white cursor-pointer"
          onClick={() => navigate("/")}
        />

        {/* DESKTOP MENU */}
        <div className="hidden lg:flex items-center gap-4 text-white">
          {!userData && (
            <span
              onClick={() => navigate("/login")}
              className="px-6 py-2 border border-white rounded-lg cursor-pointer hover:bg-white hover:text-black transition"
            >
              Login
            </span>
          )}

          {userData && (
            <>
              {/* PROFILE ICON */}
              <div
                onClick={() => setShowPro((prev) => !prev)}
                className="w-[45px] h-[45px] rounded-full border-2 border-white flex items-center justify-center cursor-pointer"
              >
                {userData.photoUrl ? (
                  <img
                    src={userData.photoUrl}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-bold">
                    {userData.name?.[0]?.toUpperCase()}
                  </span>
                )}
              </div>

              {/* DASHBOARD (EDUCATOR ONLY) */}
              {userData.role === "educator" && (
                <span
                  onClick={() => navigate("/dashboard")}
                  className="px-6 py-2 border border-white rounded-lg cursor-pointer hover:bg-white hover:text-black transition"
                >
                  Dashboard
                </span>
              )}

              {/* LOGOUT */}
              <span
                onClick={handleLogout}
                className="px-6 py-2 bg-white text-black rounded-lg cursor-pointer hover:bg-gray-200 transition"
              >
                Logout
              </span>
            </>
          )}
        </div>

        {/* HAMBURGER ICON */}
        <GiHamburgerMenu
          className="lg:hidden w-7 h-7 fill-white cursor-pointer"
          onClick={() => setShowHam(true)}
        />
      </nav>

      {/* PROFILE DROPDOWN */}
      {showPro && (
        <div className="absolute top-[80px] right-10 bg-white text-black rounded-md p-3 z-50 shadow-md">
          <span
            className="block px-4 py-2 cursor-pointer hover:bg-gray-200"
            onClick={() => navigate("/profile")}
          >
            My Profile
          </span>
          <span
            className="block px-4 py-2 cursor-pointer hover:bg-gray-200"
            onClick={() => navigate("/enrolledcourses")}
          >
            My Courses
          </span>
        </div>
      )}

      {/* MOBILE MENU */}
      {showHam && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center gap-6 text-white">
          <GiSplitCross
            className="absolute top-5 right-5 w-8 h-8 fill-white cursor-pointer"
            onClick={() => setShowHam(false)}
          />

          {userData && (
            <span
              onClick={() => navigate("/profile")}
              className="text-xl cursor-pointer"
            >
              My Profile
            </span>
          )}

          {userData?.role === "educator" && (
            <span
              onClick={() => navigate("/dashboard")}
              className="text-xl cursor-pointer"
            >
              Dashboard
            </span>
          )}

          {!userData ? (
            <span
              onClick={() => navigate("/login")}
              className="text-xl cursor-pointer"
            >
              Login
            </span>
          ) : (
            <span
              onClick={handleLogout}
              className="text-xl cursor-pointer"
            >
              Logout
            </span>
          )}
        </div>
      )}
    </>
  );
}

export default Nav;
