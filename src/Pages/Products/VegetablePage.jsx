import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AOS from "aos";
import tomatoImg from "../../assets/tomatoImg.jpeg";
import potatoImg from "../../assets/potatoImg.png";
import carrotImg from "../../assets/carrotImg.jpeg";
import onionImg from "../../assets/onionImg.png";
import spinachImg from "../../assets/spinachImg.jpeg";
import capsicumImg from "../../assets/capsicumImg.jpg"
import { IoCartOutline } from "react-icons/io5";
import Footer from "../Footer";
import toast from "react-hot-toast";

const vegetablesData = [
  { src: tomatoImg, name: "Tomato", msp: "₹20/kg" },
  { src: potatoImg, name: "Potato", msp: "₹15/kg" },
  { src: carrotImg, name: "Carrot", msp: "₹30/kg" },
  { src: onionImg, name: "Onion", msp: "₹25/kg" },
  { src: spinachImg, name: "Spinach", msp: "₹10/bundle" },
  {src: capsicumImg, name: "Capsicum", msp: "₹180/kg"}
];

const VegetablesPage = () => {
  const [weights, setWeights] = useState({});
  const [cartCount, setCartCount] = useState(0);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      mirror: false,
    });

    // Initialize cart count
    const updateCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      const totalCount = cartItems.reduce(
        (sum, item) => sum + (item.weight > 0 ? 1 : 0),
        0
      );
      setCartCount(totalCount);
    };

    updateCartCount();
  }, []);

  const handleRoleChange = (e) => {
    navigate(e.target.value);
  };

  const handleWeightChange = (name, value) => {
    const numericValue = value === "" ? "" : parseFloat(value);

    // Validate value
    if (numericValue === "" || (numericValue > 0 && numericValue <= 10)) {
      setWeights((prevWeights) => ({
        ...prevWeights,
        [name]: numericValue,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "Value must be in the range from 1 to 10",
      }));
    }
  };

  const handleAddToCart = (name) => {
    const weight = weights[name] || 0;

    if (weight <= 0) {
      toast.error(`Please enter a valid weight for ${name}`);
      return;
    }
  
    // Add item to localStorage
    const currentCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    const itemIndex = currentCart.findIndex((item) => item.name === name);

    if (itemIndex > -1) {
      // Update existing item
      currentCart[itemIndex].weight = weight;
    } else {
      // Add new item
      currentCart.push({
        name,
        weight,
        msp: vegetablesData.find((veg) => veg.name === name).msp,
      });
    }

    localStorage.setItem("cartItems", JSON.stringify(currentCart));

    // Update cart count
    const updatedCartItems =
      JSON.parse(localStorage.getItem("cartItems")) || [];
    const totalCount = updatedCartItems.reduce(
      (sum, item) => sum + (item.weight > 0 ? 1 : 0),
      0
    );
    setCartCount(totalCount);

    toast.success(`Added ${weight}kg of ${name} to the cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#004526] text-white px-4 py-3">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl md:text-4xl font-bold">Vegetables</h1>
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-lg cursor-pointer text-white hover:text-gray-200"
            >
              Home
            </Link>
            {/* Cart Icon with Badge */}
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

      <section
        className="container mx-auto px-4 py-8 md:py-16 text-sm"
        data-aos="flip-left"
      >
        <select
          className="md:text-3xl font-semibold mb-6 bg-gray-100"
          onChange={handleRoleChange}
        >
          <option value="Organic Vegetables" className="text-base ">
            Organic Vegetables
          </option>
          <option value="/fruits" className="text-base ">
            Fruits
          </option>
          <option value="/grains" className="text-base ">
            Grains
          </option>
        </select>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {vegetablesData.map((vegetable, index) => (
            <div
              key={index}
              className="card bg-white shadow-lg p-4 flex flex-col items-center"
            >
              <figure className="w-full mb-4">
                <img
                  src={vegetable.src}
                  style={{height:"180px",width:"180px"}}
                  alt={vegetable.name}
                  className="w-full h-32 md:h-48 object-cover hover:scale-125 transition-all ease-in-out duration-300"
                />
              </figure>
              <h3 className="text-lg font-semibold">{vegetable.name}</h3>
              <p className="text-sm text-gray-700 mt-2">
                Price : {vegetable.msp}
              </p>

              {/* Weight Input */}
              <div className="mt-4 flex items-center w-full">
                <input
                  type="number"
                  min="1"
                  max="10"
                  step="0.5"
                  placeholder="Weight"
                  value={weights[vegetable.name] || ""}
                  onChange={(e) =>
                    handleWeightChange(vegetable.name, e.target.value)
                  }
                  className="flex-1 p-2 border border-gray-300 rounded-l"
                />
                <span className="p-2 border border-l-0 border-gray-300 rounded-r">
                  Kg
                </span>
              </div>
              {errors[vegetable.name] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[vegetable.name]}
                </p>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={() => handleAddToCart(vegetable.name)}
                className="mt-4 bg-[#ffdc00] text-black px-4 py-3 rounded-full hover:bg-[#ffd700] hover:scale-110 transition-all duration-200"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center my-8">
        <Link
          to="/"
          className="inline-block bg-[#004526] text-white px-4 py-3 rounded-full hover:bg-[#004530] hover:scale-110 transition-all duration-200"
        >
          Back to Home
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default VegetablesPage;
