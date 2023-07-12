import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { logout } from "../store/authSlice";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md font-['Inter',sans-serif]">
      <div className="max-w-[1200px] mx-auto flex justify-between items-center px-6 py-4 flex-nowrap max-[500px]:flex-col max-[500px]:items-start max-[500px]:gap-2">
        {/* Logo */}
        <Link
          to="/"
          className="text-[1.8rem] font-bold text-white no-underline tracking-wide transition-all duration-200 hover:opacity-85 hover:scale-[1.03]"
        >
          HireFlix
        </Link>

        {/* User Info */}
        {user && (
          <div className="flex items-center gap-3 flex-nowrap max-[500px]:w-full max-[500px]:justify-between">
            <span className="text-white font-semibold text-[1.1rem] whitespace-nowrap drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
              Hello, {user.name}
            </span>
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg border-none shadow-md cursor-pointer transition-all duration-200 hover:bg-gray-100 hover:scale-105"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
