import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFarmerProducts, updateStock } from "../../Redux/Slices/farmerSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Header from "../../Pages/Header";
import Footer from "../../Pages/Footer";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import AOS from "aos";

const UpdateStock = () => {
  const [formData, setFormData] = useState({ productId: "", stock: "" });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    products,
    error,
    loading: productsLoading,
  } = useSelector((state) => state.farmer);

  // Fetch farmer's products on mount
  useEffect(() => {
    dispatch(getFarmerProducts());
    AOS.init({
      duration: 1000,
      once: false,
      mirror: false,
    });
  }, [dispatch]);

  // Handle errors from getFarmerProducts
  useEffect(() => {
    if (error) {
      toast.error(error, { duration: 3000, position: "top-right" });
      dispatch({ type: "farmer/clearError" });
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!formData.productId) {
      toast.error("Please select a product.", {
        duration: 3000,
        position: "top-right",
      });
      setLoading(false);
      return;
    }

    const stock = parseFloat(formData.stock);
    if (isNaN(stock) || stock < 0) {
      toast.error("Stock must be a non-negative number.", {
        duration: 3000,
        position: "top-right",
      });
      setLoading(false);
      return;
    }

    try {
      await dispatch(
        updateStock({ productId: formData.productId, stock })
      ).unwrap();
      toast.success("Stock updated successfully!", {
        duration: 3000,
        position: "top-right",
      });
      navigate("/dashboard");
    } catch (error) {
      toast.error(error || "Failed to update stock", {
        duration: 3000,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header className="w-full" />
      <div className="flex flex-col items-center justify-center flex-grow p-6">
        <div
          className="relative max-w-md w-full bg-white shadow-lg rounded-lg p-8 transition-all duration-300 transform hover:shadow-xl"
          data-aos="fade-up"
        >
          <button
            className="absolute left-4 top-4 flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors duration-200"
            onClick={() => navigate("/dashboard")}
            aria-label="Go back"
          >
            <FaRegArrowAltCircleLeft className="text-2xl" />
          </button>
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Update Stock
          </h2>
          {productsLoading ? (
            <div className="text-center text-gray-600">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="text-center text-gray-600">
              No products available to update.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="productId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Select Product
                </label>
                <select
                  id="productId"
                  name="productId"
                  value={formData.productId}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004526] transition-all duration-200"
                  required
                >
                  <option value="" disabled>
                    Select a product
                  </option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name} (₹{product.price}/kg, {product.quantity}{" "}
                      kg)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="stock"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  New Stock (kg)
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="Enter new stock (e.g., 50)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004526] transition-all duration-200"
                  required
                  min="0"
                  step="0.1"
                />
              </div>
              <button
                type="submit"
                className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-all duration-200 ${
                  loading || !formData.productId
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#004526] hover:bg-[#004540]"
                }`}
                disabled={loading || !formData.productId}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Updating Stock...
                  </span>
                ) : (
                  "Update Stock"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UpdateStock;
