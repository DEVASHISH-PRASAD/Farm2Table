import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IoCartOutline } from "react-icons/io5";
import AOS from "aos";
import { getAllItems, updateProductQuantity, updateProductPrice } from "../../Redux/Slices/ProductSlice";
import Footer from "../Footer";
import toast from "react-hot-toast";

const VegetablesPage = () => {
  const [weights, setWeights] = useState({});
  const [cartCount, setCartCount] = useState(0);
  const [errors, setErrors] = useState({});
  const [category, setCategory] = useState("vegetables");
  const [searchTerm, setSearchTerm] = useState("");
  const [updatedQuantities, setUpdatedQuantities] = useState({}); 
  const [updatedPrices, setUpdatedPrices] = useState({}); // To keep track of updated prices

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector((state) => state.products.items);
  const loading = useSelector((state) => state.products.loading);
  const error = useSelector((state) => state.products.error);
  const userData = useSelector((state) => state.auth.data);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: false,
    });

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

  const handleRoleChange = (e) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
    navigate(newCategory);
  };

  const handleWeightChange = (name, value) => {
    const numericValue = value === "" ? "" : parseFloat(value);
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

    const currentCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    const itemIndex = currentCart.findIndex((item) => item.name === name);
    const price = items.find((item) => item.name === name).price;

    if (itemIndex > -1) {
      currentCart[itemIndex].weight = weight;
      currentCart[itemIndex].totalCost = weight * price;
    } else {
      currentCart.push({
        name,
        weight,
        price,
        totalCost: weight * price,
      });
    }

    localStorage.setItem("cartItems", JSON.stringify(currentCart));
    const updatedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const totalCount = updatedCartItems.reduce(
      (sum, item) => sum + (item.weight > 0 ? 1 : 0),
      0
    );
    setCartCount(totalCount);
    setWeights((prevWeights) => ({
      ...prevWeights,
      [name]: "",
    }));
    toast.success(`Added ${weight}kg of ${name} to the cart!`);
  };

  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity <= 0 || isNaN(quantity)) {
      toast.error("Please enter a valid quantity.");
      return;
    }

    const confirmUpdate = window.confirm("Are you sure you want to update the quantity?");
    if (confirmUpdate) {
      dispatch(updateProductQuantity({ id: productId, quantity })).then(() => {
        setUpdatedQuantities((prev) => ({
          ...prev,
          [productId]: quantity,
        }));
      }).catch(() => {
        toast.error("Failed to update product quantity.");
      });
    }
  };

  // New method to handle price update
  const handleUpdatePrice = (productId, price) => {
    if (price <= 0 || isNaN(price)) {
      toast.error("Please enter a valid price.");
      return;
    }

    const confirmUpdate = window.confirm("Are you sure you want to update the price?");
    if (confirmUpdate) {
      dispatch(updateProductPrice({ id: productId, price })).then(() => {
        setUpdatedPrices((prev) => ({
          ...prev,
          [productId]: price,
        }));
      }).catch(() => {
        toast.error("Failed to update product price.");
      });
    }
  };

  // Filter items based on search term
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#004526] text-white px-4 py-3">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl md:text-4xl font-bold">Vegetables</h1>

          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search for Vegetables.."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-2 py-1 rounded-md text-black ml-2 w-full sm:w-48 md:w-64 lg:w-80"
            />
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

      <section className="container mx-auto px-4 py-8 md:py-16 text-sm">
        <select
          className="md:text-3xl font-semibold mb-6 bg-gray-100"
          onChange={handleRoleChange}
        >
          <option value="/vegetables" className="text-base">
            Vegetables
          </option>
          <option value="/fruits" className="text-base">
            Fruits
          </option>
          <option value="/grains" className="text-base">
            Grains
          </option>
        </select>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            filteredItems.map((item, index) => (
              <div
                key={index}
                className="card bg-white shadow-lg p-4 flex flex-col items-center"
                data-aos="zoom-in"
              >
                <figure className="w-full mb-4">
                  <img
                    src={item.img.secure_url}
                    alt={item.name}
                    className="w-38 h-32 md:h-48 object-cover hover:scale-125 transition-all ease-in-out duration-300"
                  />
                </figure>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-700 mt-2">
                  Price : ₹{item.price}/
                  {item.soldInPieces
                    ? "piece"
                    : item.soldInDozen
                    ? "dozen"
                    : "Kg"}
                </p>

                <div className="mt-4 flex items-center w-full">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    step="0.5"
                    value={weights[item.name] || ""}
                    onChange={(e) =>
                      handleWeightChange(item.name, e.target.value)
                    }
                    className="flex-1 p-2 border border-gray-300 rounded-l"
                  />
                  <span className="p-2 border border-l-0 border-gray-300 rounded-r">
                    {item.soldInPieces
                      ? "piece"
                      : item.soldInDozen
                      ? "dozen"
                      : "Kg"}
                  </span>
                </div>
                {errors[item.name] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[item.name]}
                  </p>
                )}

                <button
                  onClick={() => handleAddToCart(item.name)}
                  className="mt-4 bg-[#ffdc00] text-black px-4 py-3 rounded-full hover:bg-[#ffd700] hover:scale-110 transition-all duration-200"
                >
                  Add to Cart
                </button>

                {userData.role === "ADMIN" && (
                  <div className="mt-4 flex items-center w-full">
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      step="1"
                      value={updatedQuantities[item._id] || item.quantity}
                      onChange={(e) =>
                        setUpdatedQuantities((prev) => ({
                          ...prev,
                          [item._id]: e.target.value,
                        }))
                      }
                      placeholder="Update Qty"
                      className="flex-1 p-2 border border-gray-300 rounded-l"
                    />
                    <button
                      onClick={() =>
                        handleUpdateQuantity(
                          item._id,
                          updatedQuantities[item._id]
                        )
                      }
                      className="p-2 ml-2 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
                    >
                      Update Quantity
                    </button>
                  </div>
                )}

                {userData.role === "ADMIN" && (
                  <div className="mt-4 flex items-center w-full">
                    <input
                      type="number"
                      min="0"
                      max="10000"
                      step="1"
                      value={updatedPrices[item._id] || item.price}
                      onChange={(e) =>
                        setUpdatedPrices((prev) => ({
                          ...prev,
                          [item._id]: e.target.value,
                        }))
                      }
                      placeholder="Update Price"
                      className="flex-1 p-2 border border-gray-300 rounded-l"
                    />
                    <button
                      onClick={() =>
                        handleUpdatePrice(item._id, updatedPrices[item._id])
                      }
                      className="p-2 ml-2 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
                    >
                      Update Price
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      <div className="text-center my-8">
        <Link
          to="/"
          className="inline-block bg-[#004526] text-white px-8 py-4 rounded-full hover:bg-green-600 transition-all"
        >
          Back to Home
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default VegetablesPage;
