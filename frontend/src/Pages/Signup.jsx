import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUpload } from "react-icons/fa";
import AOS from "aos";
import Header from "./Header";
import Footer from "./Footer";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { createAccount } from "../Redux/Slices/AuthSlice";

const SignupForm = () => {
  const [profileImage, setProfileImage] = useState();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    avatar: "",
    confirmPassword: "",
    phone: "",
    role:""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  function getImage(event) {
    event.preventDefault();
    const uploadedImage = event.target.files[0];

    if (uploadedImage) {
      setFormData({ ...formData, avatar: uploadedImage });
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedImage);
      fileReader.addEventListener("load", function () {
        setProfileImage(this.result);
      });
    }
  }

  useState(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: false,
    });
  }, []);

  async function createNewAccount(event) {
    event.preventDefault();
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    const fData = new FormData();
    fData.append("fullname", formData.fullname);
    fData.append("email", formData.email);
    fData.append("password", formData.password);
    fData.append("phone", formData.phone);
    fData.append("avatar", formData.avatar);
    fData.append("role",formData.role);

    const response = await dispatch(createAccount(fData)).unwrap();
    if (response?.success) {
      navigate("/");
    }
    
    setFormData({
      fullname: "",
      email: "",
      password: "",
      avatar: "",
      confirmPassword: "",
      phone: "",
      role:""
    });
    setProfileImage("");
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 ">
        <div
          className="card w-full max-w-lg shadow-lg bg-white p-8 rounded-xl mt-4 mb-4"
          data-aos="flip-left"
        >
          <button
            className="absolute top-4 left-4 text-gray-700 hover:text-gray-900 flex items-center"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <FaArrowLeft className="mr-2 mt-2 text-xl" />
          </button>
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Sign Up
          </h2>
          <form onSubmit={createNewAccount}>
            <div className="form-control mb-4 text-center">
              <div className="flex flex-col items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={getImage}
                  id="profileImageUpload"
                  className="hidden"
                />
                <label
                  htmlFor="profileImageUpload"
                  className="cursor-pointer flex flex-col items-center justify-center w-40 h-40 rounded-full border-4 border-gray-300 bg-black-50 relative"
                  aria-label="Upload profile image"
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile Preview"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <>
                      <FaUpload className="text-gray-500 text-3xl" />
                      <span className="mt-2 text-gray-600">Upload Image</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className="form-control mb-4">
              <label className="label font-medium text-gray-700">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                className="input input-bordered w-full px-4 py-2"
                required
              />
            </div>

            <div className="form-control mb-4">
              <label className="label font-medium text-gray-700">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input input-bordered w-full px-4 py-2"
                required
              />
            </div>

            <div className="form-control mb-4">
              <label className="label font-medium text-gray-700">
                <span className="label-text">Phone Number</span>
              </label>
              <input
                type="number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input input-bordered w-full px-4 py-2"
                required
              />
            </div>

            <div className="form-control mb-4">
              <label className="label font-medium text-gray-700">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input input-bordered w-full px-4 py-2"
                required
              />
            </div>

            <div className="form-control mb-4">
              <label className="label font-medium text-gray-700">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input input-bordered w-full px-4 py-2"
                required
              />
            </div>

            <div className="form-control mb-4">
              <label className="label font-medium text-gray-700">
                <span className="label-text">Role</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="select select-bordered w-full px-4 py-2"
                required
              >
                <option value="" disabled>
                  Select a Role
                </option>
                <option value="FARMER">Farmer</option>
                <option value="CUSTOMER">Customer</option>
              </select>
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                className="bg-[#004526] text-white py-2 px-4 rounded-lg hover:bg-teal-700"
              >
                Sign Up
              </button>
            </div>

            <div className="text-center mt-4">
              <p className="text-gray-600">
                Already a member?{" "}
                <a href="/login" className="text-blue-500 hover:underline">
                  Login
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignupForm;
