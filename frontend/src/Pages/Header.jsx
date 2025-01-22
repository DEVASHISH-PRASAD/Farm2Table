import React, { useEffect, useState } from "react";
import farm from "../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { getUserData, logout } from "../Redux/Slices/AuthSlice";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
  const userData = useSelector((state) => state?.auth?.data);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getUserData());
    }
  }, [dispatch]);

  function handleLogout() {
    dispatch(logout());
  }

  return (
    <header className="bg-[#004526]">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center md:ml-6">
          <img src={farm} className="w-16 md:w-20 pr-4" alt="Farm Logo" />
          <h1 className="text-2xl md:text-4xl font-bold text-white">
            FarmToMarket
          </h1>
        </div>

        <div className="md:hidden">
          <button
            className="text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
        <nav className="hidden md:flex space-x-4">
          <a href="/" className="text-lg text-white hover:text-gray-200">
            Home
          </a>
          <a href="/aboutUs" className="text-lg text-white hover:text-gray-200">
            About
          </a>
          <a
            href="/products"
            className="text-lg text-white hover:text-gray-200"
          >
            Products
          </a>
          <a
            href="/contactUs"
            className="text-lg text-white hover:text-gray-200"
          >
            Contact
          </a>
          {!isLoggedIn ? (
            <>
              <a
                href="/signup"
                className="text-lg cursor-pointer text-white hover:text-gray-200"
              >
                Signup
              </a>
              <a
                href="/login"
                className="text-lg text-white hover:text-gray-200"
              >
                Login
              </a>
            </>
          ) : (
            <a
              href="/dashboard"
              className="text-lg text-white hover:text-gray-200"
            >
              <img
                src={userData?.avatar?.secure_url}
                className="w-10 h-10 m-auto rounded-full border-4 border-gray-300 shadow-lg hover:shadow-xl transition-shadow duration-300"
                alt="User Avatar"
                title="Profile"
                data-aos="flip-left"
              />
            </a>
          )}
        </nav>
      </div>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 right-0 z-50">
          <nav
            className="bg-[#004526] px-20 py-4 flex flex-col justify-center items-center rounded-lg"
            data-aos="flip-right"
          >
            <a
              href="/"
              className="block text-lg text-white hover:text-gray-200 py-2 border-b border-gray-600 w-full text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </a>
            <a
              href="/aboutUs"
              className="block text-lg text-white hover:text-gray-200 py-2 border-b border-gray-600 w-full text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </a>
            <a
              href="/products"
              className="block text-lg text-white hover:text-gray-200 py-2 border-b border-gray-600 w-full text-center"
            >
              Products
            </a>
            <a
              href="/contactUs"
              className="block text-lg text-white hover:text-gray-200 py-2 border-b border-gray-600 w-full text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </a>
            {!isLoggedIn ? (
              <>
                <a
                  href="/signup"
                  className="block text-lg cursor-pointer text-white hover:text-gray-200 py-2 border-b border-gray-600 w-full text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Signup
                </a>
                <a
                  href="/login"
                  className="block text-lg text-white hover:text-gray-200 py-2 border-b border-gray-600 w-full text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </a>
              </>
            ) : (
              <div>
                <a
                  href="/"
                  className="block text-lg cursor-pointer text-white hover:text-gray-200 py-2 border-b border-gray-600 w-full text-center" // Added border
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                >
                  Logout
                </a>
                <a
                  href="/dashboard"
                  className="block text-lg cursor-pointer text-white hover:text-gray-200 py-2 border-b border-gray-600 w-full text-center"
                >
                  Profile
                </a>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
