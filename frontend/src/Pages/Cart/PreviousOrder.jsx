import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPreviousOrders } from "../../Redux/Slices/CartSlice";
import { IoCartOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const PreviousOrder = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.cart.previousOrders) || [];
  const loading = useSelector((state) => state.cart.loading);
  const error = useSelector((state) => state.cart.error);
  const userData = useSelector((state) => state.auth.data);
  const [cartCount, setCartCount] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (userData?._id) {
      dispatch(getPreviousOrders(userData._id));
    }

    const updateCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      const totalCount = cartItems.reduce(
        (sum, item) => sum + (item.weight > 0 ? 1 : 0),
        0
      );
      setCartCount(totalCount);
    };

    window.addEventListener("storage", updateCartCount);
    updateCartCount();

    return () => {
      window.removeEventListener("storage", updateCartCount);
    };
  }, [dispatch, userData?._id]);

  const handleReorder = (order) => {
    const reorderedItems = order.items.map((item) => ({
      name: item.name,
      weight: item.weight,
      price: item.price,
      totalCost: item.weight * item.price,
    }));

    localStorage.setItem("cartItems", JSON.stringify(reorderedItems));
    setCartCount(reorderedItems.length);
    toast.success("Items added to cart!");
  };

  const getUnit = (item) => {
    if (item.soldInPieces) return "piece";
    if (item.soldInDozen) return "dozen";
    return "Kg";
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order); // Set the selected order for detailed view
  };

  const getStatusClass = (status, type) => {
    if (type === "delivery") {
      if (status === "Delivered") return "bg-green-100 text-green-500";
      if (status === "Shipped" || status === "In Transit") return "bg-blue-100 text-blue-500";
      if (status === "Out for Delivery") return "bg-yellow-100 text-yellow-500";
      return "bg-red-100 text-red-500"; // Default to not delivered
    }
    if (status === "Paid") return "bg-green-100 text-green-500";
    if (status === "Failed") return "bg-red-100 text-red-500";
    return "bg-yellow-100 text-yellow-500"; // Default to pending
  };

  if (!userData) {
    return <p className="text-center text-lg">Please log in to view your orders.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#004526] text-white px-6 py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl md:text-4xl font-bold">Previous Orders</h1>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-lg text-white hover:text-gray-200 transition">
              Home
            </Link>
            <Link to="/cart" className="relative flex items-center">
              <IoCartOutline className="w-8 h-8 cursor-pointer text-white" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-6 py-12 md:py-16">
        {loading ? (
          <p className="text-center">Loading orders...</p>
        ) : error ? (
          <p className="text-center text-red-500">{typeof error === "string" ? error : error.message}</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-lg">No previous orders found.</p>
        ) : selectedOrder ? ( // If an order is selected, show its details
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h3 className="text-2xl font-semibold">Order Date: {new Date(selectedOrder.createdAt).toLocaleString()}</h3>
            <div className="mt-4 text-gray-600">
              <p className="font-semibold text-lg">Delivery Status: 
                <span className={`ml-2 ${getStatusClass(selectedOrder.deliveryStatus, "delivery")}`}>
                  {selectedOrder.deliveryStatus}
                </span>
              </p>
              <p className="font-semibold text-lg">Payment Status: 
                <span className={`ml-2 ${getStatusClass(selectedOrder.status, "payment")}`}>
                  {selectedOrder.status}
                </span>
              </p>
              <p className="font-semibold text-lg">Payment Method: 
                <span className="ml-2 bg-yellow-100 text-yellow-600">{selectedOrder.paymentMethod}</span>
              </p>
            </div>
            <div className="mt-6">
              <h4 className="text-lg font-semibold">Items:</h4>
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between py-2 border-b">
                  <span>{item.name} ({item.weight} {getUnit(item)})</span>
                  <span>₹{item.totalCost}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 font-semibold">
              <p>Total: ₹{selectedOrder.totalAmount.toFixed(2)}</p>
            </div>
            <div className="mt-6 flex space-x-4">
              <button
                onClick={() => handleReorder(selectedOrder)}
                className="px-6 py-3 bg-[#ffdc00] text-black rounded-full hover:bg-[#ffd700] transition"
              >
                Reorder
              </button>
              <button
                onClick={() => setSelectedOrder(null)} // Go back to the order list
                className="px-6 py-3 bg-gray-300 text-black rounded-full hover:bg-gray-400 transition"
              >
                Back to Orders
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order, index) => (
              <div
                key={index}
                className={`p-6 shadow-md rounded-lg cursor-pointer hover:shadow-xl transition ${getStatusClass(order.status, "payment")} ${getStatusClass(order.deliveryStatus, "delivery")}`}
                onClick={() => handleViewDetails(order)} // Click to view details of the order
              >
                <h4 className="text-xl font-semibold">Order Date: {new Date(order.createdAt).toLocaleString()}</h4>
                <div className="mt-2 text-gray-600">
                  <p className="font-semibold">Delivery Status: 
                    <span className={`ml-2 ${getStatusClass(order.deliveryStatus, "delivery")}`}>
                      {order.deliveryStatus}
                    </span>
                  </p>
                  <p className="font-semibold">Payment Status: 
                    <span className={`ml-2 ${getStatusClass(order.status, "payment")}`}>
                      {order.status}
                    </span>
                  </p>
                  <p className="font-semibold">Payment Method: 
                    <span className="ml-2 bg-yellow-100 text-yellow-600">{order.paymentMethod}</span>
                  </p>
                </div>
                <div className="mt-4">
                  {order.items.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="text-sm text-gray-600">
                      {item.name} ({item.weight} {getUnit(item)})
                    </div>
                  ))}
                  {order.items.length > 3 && <p className="text-sm text-gray-600">...and more items</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="text-center my-8">
        <Link to="/" className="inline-block bg-[#004526] text-white px-8 py-4 rounded-full hover:bg-green-600 transition">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default PreviousOrder;
