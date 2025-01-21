import React from "react";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/Slices/AuthSlice";
import Header from "./Header";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state?.auth?.data);

  function handleLogout() {
    dispatch(logout());
  }

  return (
    <div>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center pt-2 p-14 max-w-md mx-auto bg-white shadow-lg rounded-lg relative">
          <button
            className="absolute left-4 top-4 flex items-center justify-center text-gray-700 hover:text-gray-900"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <FaRegArrowAltCircleLeft className="text-2xl" />
          </button>
          <div className="flex flex-col items-center justify-between">
            <img
              src={userData?.avatar?.secure_url}
              alt="Profile"
              className="w-40 m-auto rounded-full border-4 border-gray-300 shadow-lg"
            />
            <h1 className="text-2xl font-bold mb-2 capitalize text-center">
              {userData.fullname}
            </h1>
            <div className="grid grid-cols-2 gap-1 w-full">
              <p className="text-gray-700 mb-1 text-lg font-bold text-left">
                Email :
              </p>
              <p className="text-left">{userData.email}</p>
              <p className="text-gray-700 mb-1 text-lg font-bold text-left">
                User Type :
              </p>
              <p className="text-left">{userData.role}</p>
            </div>
          </div>
          {userData.role === "CUSTOMER" && (
            <button
              onClick={() => navigate("/previous-order")}
              className="mt-6 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Go to Previous Orders
            </button>
          )}
          {userData.role === "ADMIN" && (
            <>
              <button
                onClick={() => navigate("/createItem")}
                className="mt-6 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Add Product
              </button>
              <button
                onClick={() => navigate("/adminUserManagement")}
                className="mt-4 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                User Management
              </button>
            </>
          )}
          <button
            onClick={handleLogout}
            className="mt-6 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Logout
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
