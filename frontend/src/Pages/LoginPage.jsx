import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import AOS from "aos";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { login } from "../Redux/Slices/AuthSlice";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import firebaseConfig from "../../firebaseConfig"; // Assuming your Firebase config is here
import { initializeApp } from "firebase/app";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";


const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginUser = async (e) => {
    e.preventDefault();
    const fData = { email, password };

    if (!email || !password) {
      toast.error("Email and Password are required!");
      return;
    }
    const response = await dispatch(login(fData)).unwrap();
    if (response?.success) {
      navigate("/"); // Navigate to home or dashboard
    }
    setEmail("");
    setPassword("");
  };

  useState(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: false,
    });
  });

  return (
    <div>
      <Header />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div
          className="w-full max-w-md bg-white p-8 rounded-lg shadow-md"
          data-aos="flip-left"
        >
          <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
          <form onSubmit={loginUser}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 text-start">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 text-start">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#004526] text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors duration-300"
            >
              Login
            </button>
          </form>

          {/* Google OAuth Button */}
          <div className="flex items-center justify-center w-full text-center mt-2 rounded-sm font-semibold text-lg cursor-pointer">
  <GoogleLogin
    onSuccess={async (credentialResponse) => {
      const res = jwtDecode(credentialResponse.credential);
      const googleData = {
        email: res.email,
        password: res.sub, // Assuming you use Google ID as password
      };

      const response = await dispatch(login(googleData)).unwrap();
      if (response?.success) {
        navigate("/");
      } else {
        toast.error(response?.message || "Login failed");
      }
    }}
    onError={() => {
      toast.error("Login Failed");
    }}
  />
</div>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="/signup" className=" text-emerald-700 hover:underline">
                Sign Up
              </a>
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Forgot Password?{" "}
              <a href="/forgotPassword" className=" text-emerald-700 hover:underline">
                Reset Password
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
