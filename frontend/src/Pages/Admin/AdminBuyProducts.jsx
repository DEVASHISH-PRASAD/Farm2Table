import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllFarmerProducts,
  createAdminOrder,
  getAllUsers,
} from "../../Redux/Slices/farmerSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Header from "../../Pages/Header";
import Footer from "../../Pages/Footer";
import { FaRegArrowAltCircleLeft, FaShoppingCart } from "react-icons/fa";
import AOS from "aos";

const AdminBuyProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allProducts, users, loading, error } = useSelector(
    (state) => state.farmer
  );
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [buyModal, setBuyModal] = useState(null);
  const [orderForm, setOrderForm] = useState({
    userId: "",
    quantity: "",
    paymentMethod: "UPI",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(getAllFarmerProducts());
    dispatch(getAllUsers());
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

  const handleBuy = (product) => {
    setBuyModal(product);
    setOrderForm({ userId: "", quantity: "", paymentMethod: "UPI" });
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!orderForm.userId || !orderForm.quantity) {
      toast.error("Please select a user and enter quantity", {
        duration: 3000,
        position: "top-right",
      });
      return;
    }

    const parsedQuantity = parseFloat(orderForm.quantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      toast.error("Quantity must be a positive number", {
        duration: 3000,
        position: "top-right",
      });
      return;
    }

    if (parsedQuantity > buyModal.quantity) {
      toast.error("Quantity exceeds available stock", {
        duration: 3000,
        position: "top-right",
      });
      return;
    }

    setSubmitting(true);
    try {
      await dispatch(
        createAdminOrder({
          userId: orderForm.userId,
          productId: buyModal._id,
          farmerId: buyModal.farmerId,
          quantity: parsedQuantity,
          paymentMethod: orderForm.paymentMethod,
        })
      ).unwrap();
      toast.success("Order created successfully!", {
        duration: 3000,
        position: "top-right",
      });
      setBuyModal(null);
    } catch (err) {
      toast.error(err || "Failed to create order", {
        duration: 3000,
        position: "top-right",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts =
    categoryFilter === "all"
      ? allProducts
      : allProducts.filter((product) => product.category === categoryFilter);

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
          className="relative w-full max-w-6xl bg-white shadow-lg rounded-lg p-8 transition-all duration-300 transform hover:shadow-xl"
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
            Buy Products from Farmers
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
                      Farmer
                    </th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                      Action
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
                        {product.quantity < 10 && (
                          <span className="text-red-500 text-xs ml-2">
                            Low Stock!
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-4 border-b text-sm text-gray-600">
                        {product.category.charAt(0).toUpperCase() +
                          product.category.slice(1)}
                      </td>
                      <td className="py-2 px-4 border-b text-sm text-gray-600">
                        {product.description || "N/A"}
                      </td>
                      <td className="py-2 px-4 border-b text-sm text-gray-600">
                        {product.farmerName} ({product.farmerUser})
                      </td>
                      <td className="py-2 px-4 border-b text-sm">
                        <button
                          onClick={() => handleBuy(product)}
                          className="px-3 py-1 bg-[#004526] text-white rounded-lg hover:bg-[#004540] transition-all duration-200 flex items-center"
                          aria-label={`Buy ${product.name}`}
                        >
                          <FaShoppingCart className="mr-1" /> Buy
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

      {/* Buy Modal */}
      {buyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full"
            data-aos="zoom-in"
          >
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              Buy {buyModal.name}
            </h3>
            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="userId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Select User
                </label>
                <select
                  id="userId"
                  value={orderForm.userId}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, userId: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004526]"
                  required
                >
                  <option value="">Select a user</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.fullname} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Quantity (kg, max: {buyModal.quantity})
                </label>
                <input
                  type="number"
                  id="quantity"
                  value={orderForm.quantity}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, quantity: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004526]"
                  required
                  min="0.1"
                  step="0.1"
                  max={buyModal.quantity}
                />
              </div>
              <div>
                <label
                  htmlFor="paymentMethod"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Payment Method
                </label>
                <select
                  id="paymentMethod"
                  value={orderForm.paymentMethod}
                  onChange={(e) =>
                    setOrderForm({
                      ...orderForm,
                      paymentMethod: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004526]"
                  required
                >
                  <option value="UPI">UPI</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Net Banking">Net Banking</option>
                  <option value="Cash on Delivery">Cash on Delivery</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setBuyModal(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 bg-[#004526] text-white rounded-lg hover:bg-[#004540] transition-all duration-200 ${
                    submitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={submitting}
                >
                  {submitting ? "Placing Order..." : "Place Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default AdminBuyProducts;
