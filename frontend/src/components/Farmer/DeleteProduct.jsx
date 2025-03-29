import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteProduct } from "../../Redux/Slices/farmerSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Header from "../../Pages/Header";
import Footer from "../../Pages/Footer";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";

const DeleteProduct = () => {
  const [productId, setProductId] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(deleteProduct(productId)).unwrap();
      toast.success("Product deleted successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error || "Failed to delete product");
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
            Delete Product
          </h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="Product ID"
              className="input input-bordered w-full mb-4"
              required
            />
            <button
              type="submit"
              className="bg-red-500 text-white py-2 px-4 rounded-lg w-full"
            >
              Delete Product
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DeleteProduct;
