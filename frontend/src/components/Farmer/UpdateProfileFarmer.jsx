import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateProfileFarmer } from "../../Redux/Slices/farmerSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Header from "../../Pages/Header";
import Footer from "../../Pages/Footer";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";

const UpdateProfileFarmer = () => {
  const [formData, setFormData] = useState({
    farmName: "",
    farmSize: "",
    location: { latitude: "", longitude: "" },
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "latitude" || name === "longitude") {
      setFormData({
        ...formData,
        location: { ...formData.location, [name]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfileFarmer(formData)).unwrap();
      toast.success("Profile updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error || "Failed to update profile");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header className="w-full" />
      <div className="flex flex-col items-center justify-center flex-grow p-6">
        <div className="relative max-w-md w-full bg-white shadow-lg rounded-lg p-6">
          <button
            className="absolute left-4 top-4 flex items-center justify-center text-gray-700 hover:text-gray-900"
            onClick={() => navigate("/dashboard")}
            aria-label="Go back"
          >
            <FaRegArrowAltCircleLeft className="text-2xl" />
          </button>
          <h2 className="text-2xl font-bold mb-4 text-center">
            Update Profile
          </h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="farmName"
              value={formData.farmName}
              onChange={handleChange}
              placeholder="Farm Name"
              className="input input-bordered w-full mb-4"
            />
            <input
              type="number"
              name="farmSize"
              value={formData.farmSize}
              onChange={handleChange}
              placeholder="Farm Size"
              className="input input-bordered w-full mb-4"
            />
            <input
              type="number"
              name="latitude"
              value={formData.location.latitude}
              onChange={handleChange}
              placeholder="Latitude"
              className="input input-bordered w-full mb-4"
            />
            <input
              type="number"
              name="longitude"
              value={formData.location.longitude}
              onChange={handleChange}
              placeholder="Longitude"
              className="input input-bordered w-full mb-4"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-lg w-full"
            >
              Update Profile
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UpdateProfileFarmer;
