import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getFarmerProducts,
  deleteProduct,
} from "../../Redux/Slices/farmerSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Header from "../../Pages/Header";
import Footer from "../../Pages/Footer";
import { FaRegArrowAltCircleLeft, FaEdit, FaTrash } from "react-icons/fa";
import AOS from "aos";

const ViewProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error } = useSelector((state) => state.farmer);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [deletingProduct, setDeletingProduct] = useState(null);

  useEffect(() => {
    dispatch(getFarmerProducts());
    AOS.init({
      duration: 1000,
      once: false,
      mirror: false,
    });
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error, { duration: 3000, position: "top-right" });
      dispatch({ type: "farmer/clearError" });
    }
  }, [error, dispatch]);

  const handleDelete = (productId, productName) => {
    toast(
      (t) => (
        <div>
          <p>Are you sure you want to delete "{productName}"?</p>
          <div className="flex justify-end space-x-2 mt-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 bg-gray-300 text-gray-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                setDeletingProduct(productId);
                try {
                  await dispatch(deleteProduct(productId)).unwrap();
                  toast.success("Product deleted successfully!", {
                    duration: 3000,
                    position: "top-right",
                  });
                } catch (err) {
                  toast.error(err || "Failed to delete product", {
                    duration: 3000,
                    position: "top-right",
                  });
                } finally {
                  setDeletingProduct(null);
                  toast.dismiss(t.id);
                }
              }}
              className="px-3 py-1 bg-red-500 text-white rounded-lg"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  const handleEdit = (productId) => {
    navigate(`/edit-product/${productId}`);
  };

  const filteredProducts =
    categoryFilter === "all"
      ? products
      : products.filter((product) => product.category === categoryFilter);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const order = sortOrder === "asc" ? 1 : -1;
    if (sortBy === "name") return order * a.name.localeCompare(b.name);
    if (sortBy === "price") return order * (a.price - b.price);
    if (sortBy === "quantity") return order * (a.quantity - b.quantity);
    return 0;
  });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header className="w-full" />
      <div className="flex flex-col items-center justify-center flex-grow p-6">
        <div
          className="relative w-full max-w-5xl bg-white shadow-lg rounded-lg p-8 transition-all duration-300 transform hover:shadow-xl"
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
            Your Products
          </h2>
          <div className="flex flex-col sm:flex-row justify-between mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
            <div>
              <label
                htmlFor="categoryFilter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Filter by Category
              </label>
              <select
                id="categoryFilter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full max-w-xs p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004526] transition-all duration-200"
              >
                <option value="all">All</option>
                <option value="fruits">Fruits</option>
                <option value="grains">Grains</option>
                <option value="vegetables">Vegetables</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="sortBy"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Sort By
              </label>
              <div className="flex space-x-2">
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full max-w-xs p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004526] transition-all duration-200"
                >
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                  <option value="quantity">Quantity</option>
                </select>
                <button
                  onClick={toggleSortOrder}
                  className="px-3 py-2 bg-[#004526] text-white rounded-lg hover:bg-[#004540] transition-all duration-200"
                >
                  {sortOrder === "asc" ? "↑" : "↓"}
                </button>
              </div>
            </div>
          </div>
          {loading ? (
            <div className="text-center text-gray-600">
              <svg
                className="animate-spin h-8 w-8 mx-auto text-[#004526]"
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
              Loading products...
            </div>
          ) : sortedProducts.length === 0 ? (
            <p className="text-center text-gray-600">No products found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                      Image
                    </th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                      Name
                    </th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                      Price
                    </th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                      Quantity
                    </th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                      Category
                    </th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                      Description
                    </th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedProducts.map((product) => (
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
                            <span className="text-gray-500">No Image</span>
                          </div>
                        )}
                      </td>
                      <td className="py-2 px-4 border-b text-sm text-gray-600">
                        {product.name}
                      </td>
                      <td className="py-2 px-4 border-b text-sm text-gray-600">
                        ₹{product.price.toFixed(2)}
                      </td>
                      <td className="py-2 px-4 border-b text-sm text-gray-600">
                        {product.quantity} kg
                      </td>
                      <td className="py-2 px-4 border-b text-sm text-gray-600">
                        {product.category.charAt(0).toUpperCase() +
                          product.category.slice(1)}
                      </td>
                      <td className="py-2 px-4 border-b text-sm text-gray-600">
                        {product.description || "N/A"}
                      </td>
                      <td className="py-2 px-4 border-b text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(product._id)}
                            className="px-3 py-1 bg-[#004526] text-white rounded-lg hover:bg-[#004540] transition-all duration-200 flex items-center"
                            aria-label={`Edit ${product.name}`}
                          >
                            <FaEdit className="mr-1" /> Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(product._id, product.name)
                            }
                            className={`px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 flex items-center ${
                              deletingProduct === product._id
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            disabled={deletingProduct === product._id}
                            aria-label={`Delete ${product.name}`}
                          >
                            <FaTrash className="mr-1" />
                            {deletingProduct === product._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
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

export default ViewProducts;
