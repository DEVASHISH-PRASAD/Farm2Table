import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import toast from "react-hot-toast";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(savedCartItems);
  }, []);

  const handleRemoveItem = (name) => {
    const updatedCartItems = cartItems.filter((item) => item.name !== name);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    setCartItems(updatedCartItems);
    toast.success(`${name} removed from the cart!`);
  };

  const handleQuantityChange = (name, newWeight) => {
    if (newWeight < 0 || newWeight > 10) {
      toast.error("Value must be in the range from 0 to 10");
      return;
    }
    
    const updatedCartItems = cartItems.map((item) =>
      item.name === name ? { ...item, weight: newWeight } : item
    );
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    setCartItems(updatedCartItems);
  };

  const calculateTotalCost = () => {
    console.log(cartItems); // Debugging
    return cartItems.reduce((total, item) => {
      console.log(`Calculating: ${item.name}, Price: ${item.price}, Weight: ${item.weight}`); // Debugging
      return total + item.price * item.weight; // Assuming item.price is in ₹/kg
    }, 0);
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
                    onClick={() => handleRemoveItem(item.name)}
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
          </div>
        </section>
      </main>

      <div className="text-center my-8">
        <Link to="/" className="inline-block bg-[#004526] text-white px-4 py-3 rounded-full hover:bg-[#004530] hover:scale-110 transition-all duration-200">
          Back To Home
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
