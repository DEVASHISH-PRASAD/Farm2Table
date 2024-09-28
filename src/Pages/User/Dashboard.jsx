import React from "react";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer";
import Header from "../Header";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/previous-orders"); // Adjust the route to your needs
  };

  // Dummy data for demonstration
  const user = {
    profilePicture: "https://via.placeholder.com/150",
    name: "John Doe",
    email: "john.doe@example.com",
    userType: "Regular User",
  };

  return (
    <div>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center pt-2 p-14 max-w-md mx-auto bg-white shadow-lg rounded-lg">
          <button
            className="absolute left-[35%] flex items-center text-gray-700 hover:text-gray-900 "
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <FaRegArrowAltCircleLeft className="mr-2 mt-2 text-2xl" />
          </button>
          <div className="flex flex-col items-center justify-between">
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover mb-4"
            />
            <h1 className="text-2xl font-bold mb-2">{user.name}</h1>
            <div className="grid grid-cols-2 gap-1">
              <p className="text-gray-700 mb-1 text-lg font-bold">Email{" "} : </p>
              <p>{user.email}</p>
              <p className="text-gray-700 mb-1 text-lg font-bold">
                User Type{" "}:
              </p>
              <p>{user.userType}</p>
            </div>
          </div>
          <button
            onClick={handleNavigate}
            className="mt-6 px-4 py-2 ml-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Go to Previous Orders
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;