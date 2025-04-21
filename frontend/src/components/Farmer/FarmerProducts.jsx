import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllFarmerProducts } from "../../Redux/Slices/farmerSlice";
import Header from "../../Pages/Header";
import Footer from "../../Pages/Footer";
import { FaRegArrowAltCircleLeft, FaEdit } from "react-icons/fa";
import AOS from "aos";
import toast from "react-hot-toast";

const FarmerProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allProducts, loading, error } = useSelector((state) => state.farmer);
  const userData = useSelector((state) => state?.auth?.data);

  useEffect(() => {
    dispatch(getAllFarmerProducts());
    AOS.init({
      duration: 1000,
      once: false,
      mirror: false,
    });
    if (error) {
      toast.error(error, { duration: 3000, position: "top-right" });
      dispatch({ type: "farmer/clearError" });
    }
  }, [dispatch, error]);

  const farmerProducts = allProducts.filter(
    (p) => p.farmerId === userData?.farmerId
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header className="w-full" />
      <div className="flex flex-col items-center justify-center flex-grow p-6">
        <div
          className="relative w-full max-w-6xl bg-white shadow-lg rounded-lg p-8"
          data-aos="fade-up"
        >
          <button
            className="absolute left-4 top-4 flex items-center justify-center text-gray-700 hover:text-gray-900"
            onClick={() => navigate("/dashboard")}
            aria-label="Go back"
          >
            <FaRegArrowAltCircleLeft className="text-2xl" />
          </button>
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Your Products
          </h2>
          {loading ? (
            <div className="text-center text-gray-600">Loading...</div>
          ) : farmerProducts.length === 0 ? (
            <p className="text-center text-gray-600">No products found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left">Image</th>
                    <th className="py-2 px-4 border-b text-left">Name</th>
                    <th className="py-2 px-4 border-b text-left">Price</th>
                    <th className="py-2 px-4 border-b text-left">Quantity</th>
                    <th className="py-2 px-4 border-b text-left">Category</th>
                    <th className="py-2 px-4 border-b text-left">
                      Description
                    </th>
                    <th className="py-2 px-4 border-b text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {farmerProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">
                        {product.img?.secure_url ? (
                          <img
                            src={product.img.secure_url}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                            No Image
                          </div>
                        )}
                      </td>
                      <td className="py-2 px-4 border-b">{product.name}</td>
                      <td className="py-2 px-4 border-b">
                        ₹{product.price.toFixed(2)}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {product.quantity} kg
                      </td>
                      <td className="py-2 px-4 border-b">
                        {product.category.charAt(0).toUpperCase() +
                          product.category.slice(1)}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {product.description || "N/A"}
                      </td>
                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => navigate(`/farmer/editProduct`)}
                          className="px-3 py-1 bg-[#004526] text-white rounded-lg hover:bg-[#004540] flex items-center"
                        >
                          <FaEdit className="mr-1" /> Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FarmerProducts;
