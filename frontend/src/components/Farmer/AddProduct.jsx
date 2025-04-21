import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addProduct } from "../../Redux/Slices/farmerSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Header from "../../Pages/Header";
import Footer from "../../Pages/Footer";
import { FaRegArrowAltCircleLeft, FaUpload } from "react-icons/fa";
import AOS from "aos";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: false,
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("File size exceeds 5MB.");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Client-side validation
      const price = parseFloat(formData.price);
      const quantity = parseInt(formData.quantity, 10);
      if (isNaN(price) || price <= 0 || isNaN(quantity) || quantity < 0) {
        throw new Error(
          "Price must be positive and quantity cannot be negative"
        );
      }

      // Create FormData for multipart request
      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("quantity", formData.quantity);
      data.append("category", formData.category.toLowerCase());
      data.append("description", formData.description);
      if (imageFile) {
        data.append("image", imageFile);
      }

      const response = await dispatch(addProduct(data)).unwrap();
      toast.success("Product added successfully!", {
        duration: 3000,
        position: "top-right",
      });
      navigate("/dashboard");
      console.log("Success Response:", response);
    } catch (error) {
      const errorMessage = error.message || "Failed to add product";
      toast.error(errorMessage, {
        duration: 3000,
        position: "top-right",
      });
      console.error("Error Response:", error);
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
            Add New Product
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Product Name (e.g., Tomato)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004526] transition-all duration-200"
                required
              />
            </div>
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Price (₹/kg)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter Price (e.g., 30)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004526] transition-all duration-200"
                required
                min="0.01"
                step="0.01"
              />
            </div>
            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Stock (kg)
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Enter Stock (e.g., 50)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004526] transition-all duration-200"
                required
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004526] transition-all duration-200"
                required
              >
                <option value="" disabled>
                  Select Category
                </option>
                <option value="fruits">Fruits</option>
                <option value="grains">Grains</option>
                <option value="vegetables">Vegetables</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter Product Description (e.g., Fresh organic tomatoes)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004526] transition-all duration-200 h-32 resize-none"
              />
            </div>
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Image (Optional)
              </label>
              <div className="flex flex-col items-center">
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="image"
                  className="cursor-pointer flex flex-col items-center justify-center w-40 h-40 rounded-full border-4 border-gray-300 bg-gray-50 relative"
                  aria-label="Upload product image"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
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
            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-all duration-200 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#004526] hover:bg-[#004540]"
              }`}
              disabled={loading}
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
                  Adding Product...
                </span>
              ) : (
                "Add Product"
              )}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddProduct;
