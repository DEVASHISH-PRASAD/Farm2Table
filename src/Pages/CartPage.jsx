import React, { useState, useEffect } from "react";
import farm from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import toast from "react-hot-toast";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(savedCartItems);
  }, []);

  const navigate = useNavigate();

  const handleRemoveItem = (name) => {
    const updatedCartItems = cartItems.filter((item) => item.name !== name);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    setCartItems(updatedCartItems);
  };

  const handleQuantityChange = (name, newWeight) => {
    if(newWeight>10){
      toast.error("Value must be in range 1 to 10")
    }else{
    const updatedCartItems = cartItems.map((item) =>
      item.name === name ? { ...item, weight: newWeight } : item
    );
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    setCartItems(updatedCartItems);
  }
  };

  const calculateTotalCost = () => {
    return cartItems.reduce((total, item) => {
      const pricePerUnit = parseFloat(item.msp.split("/")[0].replace("₹", ""));
      return total + pricePerUnit * item.weight;
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-[#004526] text-white px-4 py-3">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex justify-center items-center gap-4">
            <img src={farm} alt="Logo" className="w-16 md:w-20 pr-4 " />
            <h1 className="text-2xl md:text-4xl font-bold">FarmToMarket</h1>
          </div>
          <div className="flex justify-center items-center gap-4">
            <Link
              to="/"
              className="text-lg cursor-pointer text-white hover:text-gray-200"
            >
              Home
            </Link>
            <Link className="text-lg cursor-pointer text-white hover:text-gray-200">
              <button onClick={() => navigate(-1)}>Back</button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-16 flex-grow">
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <h2 className="text-xl md:text-3xl font-semibold mb-6 col-span-full">Your Cart</h2>
          {cartItems.map((item, index) => (
            <div
              key={index}
              className="card bg-white shadow-lg p-4 flex flex-col justify-between"
              style={{ height: "300px", width:"200px" }} 
            >
              <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
              <p className="text-sm text-gray-700 mb-2">MSP: {item.msp}</p>
              <div className="mt-4 w-full">
                <label className="block text-sm mb-2">Quantity (kg):</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  max='10'
                  value={item.weight<=10?item.weight:"" || ""}
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
          ))}

          <div className="text-right mt-8 col-span-full">
            <h3 className="text-xl font-semibold">
              Total Cost: ₹{calculateTotalCost().toFixed(2)}
            </h3>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;
