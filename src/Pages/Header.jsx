import React, { useState } from "react";
import { Link } from "react-router-dom";
import farm from "../assets/logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-[#004526]">
    <div className="container mx-auto px-4 py-3 flex justify-between items-center">
      <div className="flex items-center">
        <img
          src={farm}
          className="w-16 md:w-20 pr-4 ml-[-10%] md:ml-[-10%] sm:ml-[-10%]"
          alt="Farm Logo"
        />
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
        <a
          href="/aboutUs"
          className="text-lg text-white hover:text-gray-200"
        >
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
        <a
          href="/signup"
          className="text-lg cursor-pointer text-white hover:text-gray-200"
        >
          Signup
        </a>
        <a href="/login" className="text-lg text-white hover:text-gray-200">
          Login
        </a>
      </nav>
    </div>

    {/* Mobile Menu Drawer */}
    {isMenuOpen && (
      <div className="md:hidden">
        <nav className="bg-gradient-to-r from-green-700 to-teal-500 px-4 py-4 flex flex-col justify-center items-center">
          <a
            href="/aboutUs"
            className="block text-lg text-white hover:text-gray-200 py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </a>
          <a
            href="/products"
            className="block text-lg text-white hover:text-gray-200 py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Products
          </a>
          <a
            href="/contactUs"
            className="block text-lg text-white hover:text-gray-200 py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </a>
          <a
            href="/signup"
            className="block text-lg cursor-pointer text-white hover:text-gray-200 py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Signup
          </a>
          <a
            href="/login"
            className="block text-lg text-white hover:text-gray-200 py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Login
          </a>
        </nav>
      </div>
    )}
  </header>

  );
};

export default Header;
