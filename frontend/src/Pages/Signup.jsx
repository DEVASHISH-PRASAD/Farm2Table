import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUpload } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { createAccount } from "../Redux/Slices/AuthSlice";
import toast from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import { GoogleLogin } from "@react-oauth/google";
import "react-phone-input-2/lib/style.css";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import firebaseConfig from "../../firebaseConfig";
import { jwtDecode } from "jwt-decode";  
import Header from "./Header";
import Footer from "./Footer";
import AOS from "aos";

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
    phone: "",
    password: "",
    confirmPassword: "",
    role: "CUSTOMER",
    avatar: "",
    businessName: "",
    gstNumber: "",
    latitude: "",
    longitude: "",
    crops: [],
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

  const handleCropsChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({ ...formData, crops: selectedOptions });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData({
            ...formData,
            latitude: latitude.toString(),
            longitude: longitude.toString(),
          });
          toast.success("Location fetched successfully!");
        },
        (error) => {
          toast.error("Failed to fetch location: " + error.message);
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
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
    Object.keys(formData).forEach((key) => {
      if (key === "crops") {
        formData[key].forEach(crop => formDataToSend.append("crops[]", crop));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await dispatch(createAccount(formDataToSend)).unwrap();
      if (response?.success) {
        navigate("/");
      }
      // Clear form data after successful account creation
      setFormData({
        fullname: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "CUSTOMER",
        avatar: "",
        businessName: "",
        gstNumber: "",
        latitude: "",
        longitude: "",
        crops: [],
      });
      setProfileImage("");
    } catch (error) {
      console.error("Account creation failed", error);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    const formData = new FormData();
    const res = jwtDecode(credentialResponse.credential); // Decode the Google JWT
    console.log(res);
  
    formData.append("fullname", res.name);
    formData.append("email", res.email);
    formData.append("password", res.sub); // Use the Google 'sub' as the password
    formData.append("avatar", res.picture); // Avatar from Google profile
    formData.append("role", "CUSTOMER");
    formData.append("phone", res.phone_number); // Handle phone number if present
  
    try {
      const response = await dispatch(createAccount(formData)).unwrap();
      if (response?.success) {
        navigate("/"); 
      } else if (response?.message) {
        toast.error(response.message); // Display the backend error message
      }
      // Clear form data after successful account creation
      setFormData({
        fullname: "",
        email: "",
        password: "",
        avatar: "",
        businessName: "",
        gstNumber: "",
        latitude: "",
        longitude: "",
        crops: [],
      });
      setProfileImage("");
    } catch (error) {
      console.error("Account creation failed", error)
    }
  };

  useState(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: false,
    });
  });

  // Predefined list of crops (you can expand this as needed)
  const cropOptions = [
    "Wheat",
    "Rice",
    "Corn",
    "Barley",
    "Soybean",
    "Potato",
    "Tomato",
    "Cotton",
    "Sugarcane",
    "Apple",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="card w-full max-w-lg shadow-lg bg-white p-8 rounded-xl mt-4 mb-4" data-aos="flip-left">
          <button className="absolute top-4 left-4 text-gray-700 hover:text-gray-900 flex items-center" onClick={() => navigate(-1)}>
            <FaArrowLeft className="mr-2 mt-2 text-xl" />
          </button>
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Sign Up</h2>
          <form onSubmit={handleSubmit}>
            {/* Profile Image Upload */}
            <div className="form-control mb-4 text-center">
              <div className="flex flex-col items-center">
                <input type="file" accept="image/*" onChange={handleImageUpload} id="profileImageUpload" className="hidden" />
                <label htmlFor="profileImageUpload" className="cursor-pointer flex flex-col items-center justify-center w-40 h-40 rounded-full border-4 border-gray-300 bg-black-50 relative">
                  {profileImage ? <img src={profileImage} alt="Profile Preview" className="w-full h-full object-cover rounded-full" /> : <><FaUpload className="text-gray-500 text-3xl" /><span className="mt-2 text-gray-600">Upload Image</span></>}
                </label>
              </div>
            </div>

            {/* Full Name */}
            <div className="form-control mb-4">
              <label className="label font-medium text-gray-700">Full Name</label>
              <input type="text" name="fullname" value={formData.fullname} onChange={handleChange} className="input input-bordered w-full px-4 py-2" required />
            </div>

            {/* Email Verification */}
            <div className="form-control mb-4">
              <label className="label font-medium text-gray-700">Email</label>
              <div className="flex items-center">
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="input input-bordered w-full px-4 py-2" required />
                <button
                  type="button"
                  onClick={sendEmailVerificationLink}
                  className="bg-[#004526] text-white py-1 px-3 rounded-lg ml-2 hover:bg-teal-700"
                  disabled={emailVerified}
                >
                  {emailVerified ? "Verified" : "Verify"}
                </button>
              </div>
            </div>

            {/* Phone Number */}
            <div className="form-control mb-4">
              <label className="label font-medium text-gray-700">Phone</label>
              <PhoneInput
                country={"in"}
                value={formData.phone}
                onChange={(phone) => setFormData({ ...formData, phone })}
                required
              />
            </div>

            {/* Password */}
            <div className="form-control mb-4">
              <label className="label font-medium text-gray-700">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className="input input-bordered w-full px-4 py-2" required />
            </div>

            {/* Confirm Password */}
            <div className="form-control mb-4">
              <label className="label font-medium text-gray-700">Confirm Password</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="input input-bordered w-full px-4 py-2" required />
            </div>
                <div className="form-control mb-4">
                  <label className="label font-medium text-gray-700">Location</label>
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="bg-[#004526] text-white py-2 px-4 rounded-lg hover:bg-teal-700"
                  >
                    Get Current Location
                  </button>
                  {formData.latitude && formData.longitude && (
                    <p className="mt-2 text-gray-600">
                      Latitude: {formData.latitude}, Longitude: {formData.longitude}
                    </p>
                  )}
                </div>
            {/* Role Selection */}
            <div>
              <label className="label font-medium text-gray-700">Select Type</label>
              <select name="role" value={formData.role} onChange={handleChange} className="input input-bordered w-full px-4 py-2">
                <option value="CUSTOMER">CUSTOMER</option>
                <option value="FARMER">FARMER</option>
              </select>
            </div>

            {/* Conditional Fields for FARMER */}
            {formData.role === "FARMER" && (
              <>
                <div className="form-control mb-4">
                  <label className="label font-medium text-gray-700">Crops (Select multiple)</label>
                  <select
                    name="crops"
                    multiple
                    value={formData.crops}
                    onChange={handleCropsChange}
                    className="input input-bordered w-full px-4 py-2 h-24"
                    required
                  >
                    {cropOptions.map((crop) => (
                      <option key={crop} value={crop}>
                        {crop}
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-500 mt-1">Hold Ctrl (or Cmd) to select multiple crops</p>
                </div>
              </>
            )}

            {/* Conditional Fields for WHOLESALER */}
            {formData.role === "WHOLESALER" && (
              <>
                <div className="form-control mb-4">
                  <label className="label font-medium text-gray-700">Business Name</label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    className="input input-bordered w-full px-4 py-2"
                    required
                  />
                </div>
                <div className="form-control mb-4">
                  <label className="label font-medium text-gray-700">GST Number</label>
                  <input
                    type="text"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleChange}
                    className="input input-bordered w-full px-4 py-2"
                    required
                  />
                </div>
              </>
            )}

            <button type="submit" className="bg-[#004526] text-white py-3 px-6 rounded-lg text-lg hover:bg-teal-700 mt-6 w-full">Sign Up</button>
          </form>

          {/* Google Sign-In Button */}
          <div className="flex items-center justify-center w-full text-center mt-2 rounded-sm font-semibold text-lg cursor-pointer">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => {
                console.log("Login Failed");
              }}
              useOneTap
            />
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a href="/login" className=" text-emerald-700 hover:underline">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignupForm;