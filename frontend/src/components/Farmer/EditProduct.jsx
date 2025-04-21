import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateProduct } from "../../Redux/Slices/farmerSlice";
import toast from "react-hot-toast";
import Header from "../../Pages/Header";
import Footer from "../../Pages/Footer";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import AOS from "aos";

const EditProduct = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error } = useSelector((state) => state.farmer);

  const product = products.find((p) => p._id === productId);
  const [formData, setFormData] = useState({
    name: product?.name || "",
    price: product?.price || "",
    quantity: product?.quantity || "",
    category: product?.category || "",
    description: product?.description || "",
    image: null,
  });
  const [preview, setPreview] = useState(product?.img?.secure_url || "");

  useEffect(() => {
    AOS.init({ duration: 1000, once: false, mirror: false });
    if (error) {
      toast.error(error, { duration: 3000, position: "top-right" });
      dispatch({ type: "farmer/clearError" });
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files[0]) {
      setFormData({ ...formData, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("quantity", formData.quantity);
    data.append("category", formData.category);
    data.append("description", formData.description);
    if (formData.image) data.append("image", formData.image);
    data.append("productId", productId);

    try {
      await dispatch(updateProduct(data)).unwrap();
      toast.success("Product updated successfully!", {
        duration: 3000,
        position: "top-right",
      });
      navigate("/view-products");
    } catch (err) {
      toast.error(err || "Failed to update product", {
        duration: 3000,
        position: "top-right",
      });
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
            onClick={() => navigate("/view-products")}
            aria-label="Go back"
          >
            <FaRegArrowAltCircleLeft className="text-2xl" />
          </button>
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Edit Product
          </h2>
          {product ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004526]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004526]"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity (kg)
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004526]"
                  required
                  min="0"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004526]"
                  required
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  <option value="fruits">Fruits</option>
                  <option value="grains">Grains</option>
                  <option value="vegetables">Vegetables</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004526]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image
                </label>
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded mb-2"
                  />
                )}
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
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
                {loading ? "Updating..." : "Update Product"}
              </button>
            </form>
          ) : (
            <p className="text-center text-gray-600">Product not found.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditProduct;
