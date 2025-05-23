import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchCartItems,
  removeItem,
  updateItemQuantity,
  clearCart,
  createOrder,
  verifyPayment,
  getPreviousOrders,
} from "../Redux/Slices/CartSlice";
import toast from "react-hot-toast";
import { updateStockAfterPurchase } from "../Redux/Slices/ProductSlice";

const CartPage = () => {
  const {
    items: cartItems,
    loading,
    error,
    paymentLoading,
    paymentError,
    previousOrders,
  } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state?.auth?.data);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch cart items and previous orders on mount
  useEffect(() => {
    dispatch(fetchCartItems());
    if (userData?._id) {
      dispatch(getPreviousOrders(userData._id));
    }
  }, [dispatch, userData]);

  // Debug log to check if cartItems updates
  useEffect(() => {
    console.log("Cart items updated:", cartItems);
    console.log("Previous orders:", previousOrders);
  }, [cartItems, previousOrders]);

  const calculateTotalCost = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.weight,
      0
    );
  };

  const handleQuantityChange = (name, newWeight) => {
    if (newWeight < 0 || newWeight > 10) {
      toast.error("Value must be in the range from 0 to 10");
      return;
    }
    dispatch(updateItemQuantity({ name, weight: newWeight }));
  };

  const handlePayment = async () => {
    const amount = calculateTotalCost();
    if (amount === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    const userId = userData?._id;
    const items = cartItems;

    if (!userId || !items || items.length === 0) {
      toast.error("Missing user information or cart items.");
      return;
    }

    const resultAction = await dispatch(
      createOrder({ userId, items, totalAmount: amount })
    );

    if (createOrder.fulfilled.match(resultAction)) {
      const { orderId, amount } = resultAction.payload;

      const options = {
        key: "rzp_test_mlmuwmF5W32yav",
        amount,
        currency: "INR",
        name: "FarmToMarket",
        description: "Test Transaction",
        order_id: orderId,
        handler: async function (response) {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
            response;

          if (
            !razorpay_payment_id ||
            !razorpay_order_id ||
            !razorpay_signature
          ) {
            toast.error("Missing payment details in the response.");
            return;
          }

          try {
            const verifyAction = await dispatch(
              verifyPayment({
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
                signature: razorpay_signature,
              })
            ).unwrap();

            if (verifyAction.success) {
              toast.success("Payment Verified!");
              await dispatch(updateStockAfterPurchase(cartItems));
              dispatch(clearCart());
              navigate("/");
            } else {
              toast.error("Payment verification failed. Please try again.");
            }
          } catch (error) {
            console.log(error);
            toast.error("Error verifying payment.");
          }
        },
        prefill: {
          name: userData.fullname,
          email: userData.email,
          phone: userData.phone,
        },
        theme: {
          color: "#004526",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", function (response) {
        toast.error("Payment failed. Please try again.");
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-[#004526] text-white px-4 py-3">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl md:text-4xl font-bold">Your Cart</h1>
          <Link
            to="/"
            className="text-lg cursor-pointer text-white hover:text-gray-200"
          >
            Home
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-16 flex-grow">
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading ? (
            <p>Loading cart...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cartItems.map((item, index) => (
              <div
                key={index}
                className="card bg-white shadow-lg p-4 flex flex-col justify-between"
                style={{ height: "300px", width: "200px" }}
              >
                <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                <p className="text-sm text-gray-700 mb-2">
                  Price: ₹{item.price}/kg
                </p>
                <div className="mt-4 w-full">
                  <label className="block text-sm mb-2">Quantity (kg):</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    max="10"
                    value={item.weight}
                    onChange={(e) =>
                      handleQuantityChange(
                        item.name,
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="mt-auto flex justify-center w-full">
                  <button
                    onClick={() => dispatch(removeItem(item.name))}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                  >
                    Remove Item
                  </button>
                </div>
              </div>
            ))
          )}
          {cartItems.length > 0 && (
            <div className="text-right mt-8 col-span-full">
              <h3 className="text-xl font-semibold">
                Total Cost: ₹{calculateTotalCost().toFixed(2)}
              </h3>
              <button
                onClick={handlePayment}
                disabled={loading || paymentLoading}
                className={`bg-[#004526] text-white px-4 py-2 mt-4 rounded-lg ${
                  loading || paymentLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-[#004530]"
                }`}
              >
                {loading || paymentLoading
                  ? "Processing..."
                  : "Proceed to Payment"}
              </button>
            </div>
          )}
        </section>

        {previousOrders && previousOrders.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Previous Orders</h2>
            {loading ? (
              <p>Loading previous orders...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {previousOrders.map((order, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-lg p-4 rounded-lg"
                  >
                    <p className="text-sm text-gray-700">
                      Order ID: {order.orderId}
                    </p>
                    <p className="text-sm text-gray-700">
                      Total Amount: ₹{order.totalAmount}
                    </p>
                    <p className="text-sm text-gray-700">
                      Status: {order.status}
                    </p>
                    <p className="text-sm text-gray-700">
                      Ordered On: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default CartPage;