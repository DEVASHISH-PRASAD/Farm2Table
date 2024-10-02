import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoCartOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import AOS from "aos";
import { getAllItems } from "../../Redux/Slices/ProductSlice"; 
import Footer from "../Footer";
import toast from "react-hot-toast";

const GrainsPage = () => {
  const [weights, setWeights] = useState({});
  const [cartCount, setCartCount] = useState(0);
  const [errors, setErrors] = useState({});
  const [category, setCategory] = useState("grains");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((state) => state.products.items);
  const loading = useSelector((state) => state.products.loading);
  const error = useSelector((state) => state.products.error);
  const userData = useSelector((state)=>state.auth.data);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      mirror: false,
    });

    // Update cart count from localStorage
    const updateCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      const totalCount = cartItems.reduce(
        (sum, item) => sum + (item.weight > 0 ? 1 : 0),
        0
      );
      setCartCount(totalCount);
    };

    updateCartCount();
    dispatch(getAllItems(category)).catch(() => {
      toast.error("Failed to fetch items. Please try again.");
    });
  }, [category, dispatch]);

  const handleWeightChange = (name, value) => {
    const numericValue = value === "" ? "" : parseFloat(value);

    // Validate the weight input
    if (numericValue === "" || numericValue <= 10) {
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

  const handleRoleChange = (e) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
    navigate(newCategory);
  };

  const handleAddToCart = (name) => {
    const weight = weights[name] || 0;
    if (weight <= 0) {
      toast.error(`Please enter a valid weight for ${name}`);
      return;
    }

    const currentCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    const itemIndex = currentCart.findIndex((item) => item.name === name);

    if (itemIndex > -1) {
      currentCart[itemIndex].weight = weight;
    } else {
      const item = items.find((grain) => grain.name === name);
      currentCart.push({
        name,
        weight,
        price: item.price,
      });
    }

    localStorage.setItem("cartItems", JSON.stringify(currentCart));

    const updatedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const totalCount = updatedCartItems.reduce(
      (sum, item) => sum + (item.weight > 0 ? 1 : 0),
      0
    );
    setCartCount(totalCount);

    toast.success(`Added ${weight}kg of ${name} to the cart!`);
    setWeights((prevWeights) => ({
      ...prevWeights,
      [name]: "",
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#004526] text-white px-4 py-3">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl md:text-4xl font-bold">Grains</h1>
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-lg cursor-pointer text-white hover:text-gray-200"
            >
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

      <section className="container mx-auto px-4 py-8 md:py-16 text-sm" data-aos="flip-left">
        <select
          className=" md:text-3xl font-semibold mb-6 bg-gray-100"
          onChange={handleRoleChange}
        >
          <option value="/grains" className="text-base">
            Grains
          </option>
          <option value="/vegetable" className="text-base">
            Vegetables
          </option>
          <option value="/fruits" className="text-base">
            Fruits
          </option>
        </select>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            items.map((grain, index) => (
              <div
                key={index}
                className="card bg-white shadow-lg p-4 flex flex-col items-center"
              >
                <figure className="w-full mb-4">
                  <img
                    src={grain.img.secure_url}
                    alt={grain.name}
                    className="w-full h-32 md:h-48 object-cover hover:scale-125 transition-all ease-in-out duration-300"
                  />
                </figure>
                <h3 className="text-lg font-semibold">{grain.name}</h3>
                <p className="text-sm text-gray-700 mt-2">
                  Price: ₹{grain.price}/kg
                </p>

                <div className="mt-4 flex items-center w-full">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    step="0.5"
                    value={weights[grain.name] || ""}
                    onChange={(e) =>
                      handleWeightChange(grain.name, e.target.value)
                    }
                    className="flex-1 p-2 border border-gray-300 rounded-l"
                  />
                  <span className="p-2  border border-l-0 border-gray-300 rounded-r">
                    Kg
                  </span>
                </div>
                {errors[grain.name] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[grain.name]}
                  </p>
                )}

                <button
                  onClick={() => handleAddToCart(grain.name)}
                  className="mt-4 bg-[#ffdc00] text-black px-4 py-3 rounded-full hover:bg-[#ffd700] hover:scale-110 transition-all duration-200"
                >
                  Add to Cart
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {(userData.role==="ADMIN")?
      (<div className="text-center my-8">
        <Link to="/createItem" className="inline-block bg-[#132b20] text-white px-4 py-3 rounded-full hover:bg-[#004530] hover:scale-110 transition-all duration-200">
        Add New Product
        </Link>
      </div>):(<div className="text-center my-8">
        <Link to="/" className="inline-block bg-[#004526] text-white px-4 py-3 rounded-full hover:bg-[#004530] hover:scale-110 transition-all duration-200">
          Back To Home
        </Link>
      </div>)}
      <Footer />
    </div>
  );
};

export default GrainsPage;
