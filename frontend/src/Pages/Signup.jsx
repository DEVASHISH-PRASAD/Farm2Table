import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUpload } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { createAccount } from "../Redux/Slices/AuthSlice";
import toast from "react-hot-toast";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import firebaseConfig from "../../firebaseConfig";
import Header from "./Header";
import Footer from "./Footer";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const SignupForm = () => {
  const [profileImage, setProfileImage] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "CUSTOMER",
    avatar: "",
  });

  const [emailVerified, setEmailVerified] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (event) => {
    const uploadedImage = event.target.files[0];
    if (uploadedImage) {
      setFormData({ ...formData, avatar: uploadedImage });
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedImage);
      fileReader.onload = () => {
        setProfileImage(fileReader.result);
      };
    }
  };

  const sendEmailVerificationLink = async () => {
    try {
      if (!formData.password) {
        toast.error("Password is required for email verification.");
        return;
      }
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await sendEmailVerification(userCredential.user);
      toast.success("Verification email sent! Please verify before signing up.");
      setEmailVerified(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!emailVerified) {
      toast.error("Please verify your email before signing up.");
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => formDataToSend.append(key, formData[key]));

    const response = await dispatch(createAccount(formDataToSend)).unwrap();
    if (response?.success) {
      navigate("/");
    }

    setFormData({
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "CUSTOMER",
      avatar: "",
    });
    setProfileImage("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="card w-full max-w-lg shadow-lg bg-white p-8 rounded-xl mt-4 mb-4">
          <button
            className="absolute top-4 left-4 text-gray-700 hover:text-gray-900 flex items-center"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft className="mr-2 mt-2 text-xl" />
          </button>
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Sign Up
          </h2>
          <form onSubmit={handleSubmit}>
            {/* Profile Image Upload */}
            <div className="form-control mb-4 text-center">
              <div className="flex flex-col items-center">
                <input type="file" accept="image/*" onChange={handleImageUpload} id="profileImageUpload" className="hidden" />
                <label htmlFor="profileImageUpload" className="cursor-pointer flex flex-col items-center justify-center w-40 h-40 rounded-full border-4 border-gray-300 bg-gray-50 relative">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile Preview" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <>
                      <FaUpload className="text-gray-500 text-3xl" />
                      <span className="mt-2 text-gray-600">Upload Image</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Full Name */}
            <div className="form-control mb-4">
              <label className="label font-medium text-gray-700">Full Name</label>
              <input type="text" name="fullname" value={formData.fullname} onChange={handleChange} className="input input-bordered w-full px-4 py-2" required />
            </div>

            {/* Email */}
            <div className="form-control mb-4">
              <label className="label font-medium text-gray-700">Email</label>
              <div className="flex items-center">
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="input input-bordered w-full px-4 py-2" required />
                {!emailVerified ? (
                  <button type="button" onClick={sendEmailVerificationLink} className="bg-green-600 text-white py-1 px-3 rounded-lg ml-2 hover:bg-green-700">Verify</button>
                ) : (
                  <span className="text-green-600 font-medium ml-2">Verified</span>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="form-control mb-4">
              <label className="label font-medium text-gray-700">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className="input input-bordered w-full px-4 py-2" required />
            </div>

            <button type="submit" className="bg-green-600 text-white py-3 px-6 rounded-lg text-lg hover:bg-green-700 mt-6 w-full">
              Sign Up
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignupForm;
