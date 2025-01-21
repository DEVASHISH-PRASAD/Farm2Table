import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { requestResetPassword } from "../../Redux/Slices/AuthSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";

const RequestResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email.");
      return;
    }
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await dispatch(requestResetPassword(email));
      if (response.payload?.message) {
        toast.success("Reset link sent! Check your email.");
        navigate("/login");
      }
    } catch (error) {
      toast.error("Failed to send reset password link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Header className="w-full" />

      <div className="flex-grow flex items-center justify-center px-4 mt-5 mb-5">
        <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 max-w-md w-full">
          <h2 className="text-2xl font-semibold text-gray-700 text-center">Forgot Password?</h2>
          <p className="text-gray-500 text-center mt-2">
            Enter your email below and we'll send you a password reset link.
          </p>

          <form onSubmit={handleSubmit} className="mt-6">
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-medium">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#004526] text-white py-3 px-6 rounded-lg text-lg hover:bg-teal-700 transition duration-300 disabled:bg-gray-400"
            >
              {loading ? "Sending..." : "Request Reset Link"}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-4">
            Remembered your password?{" "}
            <a href="/login" className="text-emerald-700 hover:underline">
              Go back to login
            </a>
          </p>
        </div>
      </div>

      {/* Ensure Footer takes full width */}
      <Footer className="w-full" />
    </div>
  );
};

export default RequestResetPasswordPage;
