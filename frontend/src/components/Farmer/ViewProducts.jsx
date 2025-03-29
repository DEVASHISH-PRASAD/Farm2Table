import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFarmerProducts } from "../../Redux/Slices/farmerSlice";
import { useNavigate } from "react-router-dom";
import Header from "../../Pages/Header";
import Footer from "../../Pages/Footer";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";

const ViewProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products } = useSelector((state) => state.farmer);

  useEffect(() => {
    dispatch(getFarmerProducts());
  }, [dispatch]);

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
          {products.length > 0 ? (
            <ul>
              {products.map((product) => (
                <li key={product._id} className="mb-2">
                  {product.name} - Price: {product.price}, Stock:{" "}
                  {product.stock}
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
