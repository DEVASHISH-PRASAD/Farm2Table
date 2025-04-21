import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrdersReceived,
  updateOrderDeliveryStatus,
} from "../../Redux/Slices/farmerSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Header from "../../Pages/Header";
import Footer from "../../Pages/Footer";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import AOS from "aos";

const ViewOrdersReceived = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading, error } = useSelector((state) => state.farmer);
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingOrder, setUpdatingOrder] = useState(null);

  useEffect(() => {
    dispatch(getOrdersReceived());
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

  const handleDeliveryStatusChange = async (orderId, newStatus) => {
    setUpdatingOrder(orderId);
    try {
      await dispatch(
        updateOrderDeliveryStatus({ orderId, deliveryStatus: newStatus })
      ).unwrap();
      toast.success("Delivery status updated successfully!", {
        duration: 3000,
        position: "top-right",
      });
    } catch (err) {
      toast.error(err || "Failed to update delivery status", {
        duration: 3000,
        position: "top-right",
      });
    } finally {
      setUpdatingOrder(null);
    }
  };

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((order) => order.deliveryStatus === statusFilter);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getNextDeliveryStatusOptions = (currentStatus) => {
    const statusOrder = [
      "Not Dispatched",
      "Shipped",
      "In Transit",
      "Out for Delivery",
      "Delivered",
    ];
    const currentIndex = statusOrder.indexOf(currentStatus);
    return statusOrder.slice(currentIndex + 1);
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
            Orders Received
          </h2>
          <div className="mb-4">
            <label
              htmlFor="statusFilter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Filter by Delivery Status
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full max-w-xs p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004526] transition-all duration-200"
            >
              <option value="all">All</option>
              <option value="Not Dispatched">Not Dispatched</option>
              <option value="Shipped">Shipped</option>
              <option value="In Transit">In Transit</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
          {loading ? (
            <div className="text-center text-gray-600">Loading orders...</div>
          ) : filteredOrders.length === 0 ? (
            <p className="text-center text-gray-600">No orders found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                      Order ID
                    </th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                      Products
                    </th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                      Customer
                    </th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                      Total
                    </th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                      Payment Status
                    </th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                      Delivery Status
                    </th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                      Payment Method
                    </th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                      Date
                    </th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.orderId} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b text-sm text-gray-600">
                        {order.orderId.slice(-6)}
                      </td>
                      <td className="py-2 px-4 border-b text-sm text-gray-600">
                        {order.items.map((item) => item.name).join(", ")}
                      </td>
                      <td className="py-2 px-4 border-b text-sm text-gray-600">
                        {order.user?.fullname || "N/A"}
                      </td>
                      <td className="py-2 px-4 border-b text-sm text-gray-600">
                        ₹{order.totalAmount.toFixed(2)}
                      </td>
                      <td className="py-2 px-4 border-b text-sm">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            order.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "Paid"
                              ? "bg-green-100 text-green-800"
                              : order.status === "Failed"
                              ? "bg-red-100 text-red-800"
                              : order.status === "Cancelled"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-2 px-4 border-b text-sm">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            order.deliveryStatus === "Not Dispatched"
                              ? "bg-gray-100 text-gray-800"
                              : order.deliveryStatus === "Shipped"
                              ? "bg-blue-100 text-blue-800"
                              : order.deliveryStatus === "In Transit"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.deliveryStatus === "Out for Delivery"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {order.deliveryStatus}
                        </span>
                      </td>
                      <td className="py-2 px-4 border-b text-sm text-gray-600">
                        {order.paymentMethod}
                      </td>
                      <td className="py-2 px-4 border-b text-sm text-gray-600">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="py-2 px-4 border-b text-sm">
                        {order.deliveryStatus !== "Delivered" && (
                          <select
                            value=""
                            onChange={(e) =>
                              handleDeliveryStatusChange(
                                order.orderId,
                                e.target.value
                              )
                            }
                            className={`w-40 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004526] transition-all duration-200 ${
                              updatingOrder === order.orderId
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            disabled={updatingOrder === order.orderId}
                          >
                            <option value="" disabled>
                              Update Status
                            </option>
                            {getNextDeliveryStatusOptions(
                              order.deliveryStatus
                            ).map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        )}
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

export default ViewOrdersReceived;