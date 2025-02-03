import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeItem, updateItemQuantity, clearCart, createOrder, verifyPayment } from "../Redux/Slices/CartSlice";
import toast from "react-hot-toast";
import { updateStockAfterPurchase } from "../Redux/Slices/ProductSlice";

const CartPage = () => {
  const { items: cartItems, loading, error, paymentLoading, paymentError } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state?.auth?.data);

  useEffect(() => {
    // Dynamically load the Razorpay script
    
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Calculate the total cost of the cart
  const calculateTotalCost = () => {
    return cartItems.reduce((total, item) => total + item.price * item.weight, 0);
  };

  // Handle quantity change in cart items
  const handleQuantityChange = (name, newWeight) => {
    if (newWeight < 0 || newWeight > 10) {
      toast.error("Value must be in the range from 0 to 10");
      return;
    }
    dispatch(updateItemQuantity({ name, weight: newWeight }));
  };

  // Handle payment process
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

    const resultAction = await dispatch(createOrder({ userId, items, totalAmount: amount }));

    if (createOrder.fulfilled.match(resultAction)) {
      const { orderId, amount } = resultAction.payload; // Order details from backend

      const options = {
        key: "rzp_test_mlmuwmF5W32yav", // Replace with your Razorpay key
        amount,
        currency: "INR",
        name: "FarmToMarket",
        description: "Test Transaction",
        order_id: orderId,
        handler: function (response) {
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

          dispatch(
            verifyPayment({
              paymentId: razorpay_payment_id,
              orderId: razorpay_order_id,
              signature: razorpay_signature,
            })
          )
            .then(async (response) => {
              if (response.payload.success) {
                toast.success("Payment Verified!");
                await dispatch(updateStockAfterPurchase(cartItems));
                dispatch(clearCart());
                navigate("/");
              } else {
                toast.error("Payment verification failed. Please try again.");
              }
            })
            .catch((error) => {
              toast.error("Error verifying payment.");

            });
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
          <Link to="/" className="text-lg cursor-pointer text-white hover:text-gray-200">
            Home
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-16 flex-grow">
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cartItems.map((item, index) => (
              <div
                key={index}
                className="card bg-white shadow-lg p-4 flex flex-col justify-between"
                style={{ height: "300px", width: "200px" }}
              >
                <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                <p className="text-sm text-gray-700 mb-2">Price: ₹{item.price}/kg</p>
                <div className="mt-4 w-full">
                  <label className="block text-sm mb-2">Quantity (kg):</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    max="10"
                    value={item.weight}
                    onChange={(e) =>
                      handleQuantityChange(item.name, parseFloat(e.target.value))
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
          <div className="text-right mt-8 col-span-full">
            <h3 className="text-xl font-semibold">
              Total Cost: ₹{calculateTotalCost().toFixed(2)}
            </h3>
            <button
              onClick={handlePayment}
              disabled={loading || paymentLoading}
              className={`bg-[#004526] text-white px-4 py-2 mt-4 rounded-lg ${
                loading || paymentLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#004530]"
              }`}
            >
              {loading || paymentLoading ? "Processing..." : "Proceed to Payment"}
            </button>
          </div>
        

        </section>
      </main>
    </div>
  );
};

export default CartPage;