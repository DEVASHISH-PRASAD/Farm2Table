import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetPassword } from "../../Redux/Slices/AuthSlice";
import toast from "react-hot-toast";
import Header from "../Header";
import Footer from "../Footer";

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const resetToken = new URLSearchParams(location.search).get("resetToken");

  const validatePassword = (password) => {
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(password)) return "Must include at least one uppercase letter.";
    if (!/[a-z]/.test(password)) return "Must include at least one lowercase letter.";
    if (!/[0-9]/.test(password)) return "Must include at least one number.";
    if (!/[!@#$%^&*]/.test(password)) return "Must include at least one special character.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Validate passwords before submitting
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      toast.error(passwordError);
      setErrorMessage(passwordError);
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      setErrorMessage("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const response = await dispatch(resetPassword({ resetToken, newPassword }));

      if (response.payload?.message === "Password has been reset successfully!") {
        toast.success("Password reset successfully! Redirecting...");
        setTimeout(() => navigate("/login"), 2000); // Delay redirect for better UX
      } else {
        throw new Error(response.payload?.message || "Failed to reset password.");
      }
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-1 justify-center items-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-2">🔑 Reset Your Password</h2>
          <p className="text-gray-500 text-center mb-4">Enter a strong new password to secure your account.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="block font-medium text-gray-700">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "🙈"}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
              <input
                 type={showPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                required
              />
              <button
                  type="button"
                  className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "🙈"}
                </button>
            </div>
            </div>

            {errorMessage && <p className="text-red-500 text-sm mt-2">⚠ {errorMessage}</p>}

            <button
              type="submit"
              className={`w-full py-2 rounded-lg text-white font-bold transition ${
                loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600bg-[#004526] text-white py-3 px-6 rounded-lg text-lg hover:bg-teal-700"
              }`}
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPasswordPage;
