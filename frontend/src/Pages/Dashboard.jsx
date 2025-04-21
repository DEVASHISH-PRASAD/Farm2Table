import React, { useEffect } from "react";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/Slices/AuthSlice";
import Header from "./Header";
import AOS from "aos";
import toast from "react-hot-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state?.auth?.data);

  function handleLogout() {
    dispatch(logout())
  }

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: false,
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header className="w-full" />
      <div className="flex flex-col items-center mt-6 mb-6 overflow-x-auto overflow-y-auto p-3.5 max-w-md mx-auto bg-white shadow-lg rounded-lg relative">
        {/* Back Button */}
        <button
          className="absolute left-4 top-4 flex items-center justify-center text-gray-700 hover:text-gray-900"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <FaRegArrowAltCircleLeft className="text-2xl" />
        </button>
        {/* Profile Section */}
        <div className="flex flex-col items-center justify-between">
          <img
            src={
              userData?.avatar?.secure_url || "https://via.placeholder.com/150"
            }
            alt="Profile"
            className="w-40 m-auto rounded-full border-4 border-gray-300 shadow-lg"
          />
          <button
            onClick={handleLogout}
            className="absolute right-4 top-4 flex items-center justify-center px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Logout
          </button>
          <h1 className="text-2xl font-bold mb-2 capitalize text-center">
            {userData?.fullname || "User"}
          </h1>
          <div className="grid grid-cols-2 gap-1 w-full">
            <p className="text-gray-700 mb-1 text-lg font-bold text-left">
              Email:
            </p>
            <p className="text-left">{userData?.email || "N/A"}</p>
            <p className="text-gray-700 mb-1 text-lg font-bold text-left">
              User Type:
            </p>
            <p className="text-left">{userData?.role || "N/A"}</p>
          </div>
        </div>
        {/* Navigation Buttons */}
        <div className="grid grid-cols-2 gap-4 w-full mt-6">
          {/* Common to all authenticated users */}
          {userData?.role && (
            <button
              onClick={() => navigate("/previous-order")}
              className="px-4 py-2 bg-[#004526] text-white font-semibold rounded-lg shadow-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Previous Orders
            </button>
          )}

          {/* Farmer-specific options */}
          {userData?.role === "FARMER" && (
            <>
              <button
                onClick={() => navigate("/farmer/add-product")}
                className="px-4 py-2 bg-[#004526] text-white font-semibold rounded-lg shadow-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Add Product
              </button>
              <button
                onClick={() => navigate("/farmer/products")}
                className="px-4 py-2 bg-[#004526] text-white font-semibold rounded-lg shadow-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                View & Manage Products
              </button>
              <button
                onClick={() => navigate("/farmer/orders-received")}
                className="px-4 py-2 bg-[#004526] text-white font-semibold rounded-lg shadow-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                View Orders Received
              </button>
              <button
                onClick={() => navigate("/farmer/update-profile")}
                className="px-4 py-2 bg-[#004526] text-white font-semibold rounded-lg shadow-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Update Profile
              </button>
            </>
          )}

          {/* Wholesaler-specific options */}
          {userData?.role === "WHOLESALER" && (
            <>
              <button
                onClick={() => navigate("/wholesaler/purchase")}
                className="px-4 py-2 bg-[#004526] text-white font-semibold rounded-lg shadow-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Purchase Product
              </button>
              <button
                onClick={() => navigate("/wholesaler/orders")}
                className="px-4 py-2 bg-[#004526] text-white font-semibold rounded-lg shadow-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                View Order History
              </button>
              <button
                onClick={() => navigate("/wholesaler/products")}
                className="px-4 py-2 bg-[#004526] text-white font-semibold rounded-lg shadow-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                View Available Products
              </button>
              <button
                onClick={() => navigate("/wholesaler/profile")}
                className="px-4 py-2 bg-[#004526] text-white font-semibold rounded-lg shadow-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Update Profile
              </button>
            </>
          )}

          {/* Admin-specific options */}
          {userData?.role === "ADMIN" && (
            <>
              <button
                onClick={() => navigate("/createItem")}
                className="px-4 py-2 bg-[#004526] text-white font-semibold rounded-lg shadow-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Add Product
              </button>
              <button
                onClick={() => navigate("/analytics")}
                className="px-4 py-2 bg-[#004526] text-white font-semibold rounded-lg shadow-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                View Analytics
              </button>
              <button
                onClick={() => navigate("/adminUserManagement")}
                className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                User Management
              </button>
              <button
                onClick={() => navigate("/admin/buy-products")}
                className="px-4 py-2 bg-[#004526] text-white rounded-lg hover:bg-[#004540] transition-all duration-200"
              >
                Buy Products from Farmers
              </button>
            </>
          )}

          {/* Customer-specific options */}
          {userData?.role === "CUSTOMER" && (
            <>
              <button
                onClick={() => navigate("/products")}
                className="px-4 py-2 bg-[#004526] text-white font-semibold rounded-lg shadow-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Browse Products
              </button>
              <button
                onClick={() => navigate("/cart")}
                className="px-4 py-2 bg-[#004526] text-white font-semibold rounded-lg shadow-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                View Cart
              </button>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
