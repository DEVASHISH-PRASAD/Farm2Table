import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getFarmerProducts,
  deleteProduct,
} from "../../Redux/Slices/farmerSlice";
import { useNavigate } from "react-router-dom";
import Header from "../../Pages/Header";
import Footer from "../../Pages/Footer";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import toast from "react-hot-toast";

const ViewProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error } = useSelector((state) => state.farmer);

  useEffect(() => {
    dispatch(getFarmerProducts());
  }, [dispatch]);

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await dispatch(deleteProduct(productId)).unwrap();
        toast.success("Product deleted successfully!");
      } catch (err) {
        toast.error(err || "Failed to delete product");
      }
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
          <h2 className="text-2xl font-bold mb-4 text-center">Your Products</h2>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : products.length > 0 ? (
            <ul className="space-y-4">
              {products.map((product) => (
                <li
                  key={product._id}
                  className="flex justify-between items-center"
                >
                  <span>
                    {product.name} - Price: ₹{product.price}, Stock:{" "}
                    {product.stock}
                  </span>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No products found.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ViewProducts;
