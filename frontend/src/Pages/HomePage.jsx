import React, { useEffect, useState } from "react";
import AOS from "aos";
import { IoCartOutline } from "react-icons/io5";
import img from "../assets/bgImage.jpg";
import veg from "../assets/veg.jpeg";
import dairy from "../assets/dairy.jpeg";
import fruits from "../assets/fruits.jpeg";
import farm from "../assets/logo.png";
import farm2 from "../assets/farm2.jpeg";
import farm3 from "../assets/farm3.jpeg";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserData, logout } from "../Redux/Slices/AuthSlice";

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0); // Cart count state
  const userData = useSelector((state) => state?.auth?.data);
  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
  const dispatch = useDispatch();
  const slides = [
    {
      id: 1,
      src: img,
      alt: "Fresh Produce",
      title: "Fresh From the Farm",
      description: "Delivering the freshest produce directly to your doorstep.",
    },
    {
      id: 2,
      src: farm2,
      alt: "Organic Products",
      title: "Organic and Sustainable",
      description: "Committed to sustainability and organic farming.",
    },
    {
      id: 3,
      src: farm3,
      alt: "Farm to Table",
      title: "Farm to Table",
      description: "Bringing the farm directly to your table.",
    },
  ];

   useEffect(() => {
      if (isLoggedIn) {
        dispatch(getUserData());
      }
  
      // Update cart count from localStorage
      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      const totalCount = cartItems.reduce(
        (sum, item) => sum + (item.weight > 0 ? 1 : 0),
        0
      );
      setCartCount(totalCount);
    }, [dispatch, isLoggedIn]);
 useEffect(() => {
  if (isLoggedIn) {
    dispatch(getUserData());
  }
  AOS.init({ duration: 1000, once: false, mirror: false });

  const interval = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, 3000);

  return () => clearInterval(interval);
}, [isLoggedIn]);


  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-[#004526]">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center md:ml-6">
  <img
    src={farm}
    className="w-16 md:w-20 pr-4"
    alt="Farm Logo"
  />
  <h1 className="text-2xl md:text-4xl font-bold text-white">
    FarmToMarket
  </h1>
</div>

          <div className="md:hidden">
            <button
              className="text-white focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>
          </div>
          <nav className="hidden md:flex space-x-4">
            <a href="/" className="text-lg text-white hover:text-gray-200">
              Home
            </a>
            <a
              href="/aboutUs"
              className="text-lg text-white hover:text-gray-200"
            >
              About
            </a>
            <a
              href="/products"
              className="text-lg text-white hover:text-gray-200"
            >
              Products
            </a>
            <a
              href="/contactUs"
              className="text-lg text-white hover:text-gray-200"
            >
              Contact
            </a>
            {!isLoggedIn ? (
              <>
                <a
                  href="/signup"
                  className="text-lg cursor-pointer text-white hover:text-gray-200"
                >
                  Signup
                </a>
                <a
                  href="/login"
                  className="text-lg text-white hover:text-gray-200"
                >
                  Login
                </a>
              </>
            ) : (
              <a
                href="/dashboard"
                className="text-lg text-white hover:text-gray-200"
              >
                <img
                  src={userData?.avatar?.secure_url}
      className="w-10 h-10 m-auto rounded-full border-4 border-gray-300 shadow-lg hover:shadow-xl transition-shadow duration-300"
                  data-aos='flip-left'
                />
              </a>
            )}
            {isLoggedIn&&( <Link to="/cart" className="relative flex items-center">
                        <IoCartOutline className="w-8 h-8 cursor-pointer text-white" />
                        {cartCount > 0 && (
                          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                            {cartCount}
                          </span>
                        )}
                      </Link>)}
          </nav>
        </div>

        {/* Mobile Menu Drawer */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 right-0 z-50">
            <nav
              className="bg-[#004526] px-20 py-4 flex flex-col justify-center items-center rounded-lg"
              data-aos="flip-right"
            >
              <a
                href="/"
                className="block text-lg text-white hover:text-gray-200 py-2 border-b border-gray-600 w-full text-center" // Added border
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </a>
              <a
                href="/aboutUs"
                className="block text-lg text-white hover:text-gray-200 py-2 border-b border-gray-600 w-full text-center" // Added border
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </a>
              <a
                href="/products"
                className="block text-lg text-white hover:text-gray-200 py-2 border-b border-gray-600 w-full text-center" // Added border
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </a>
              <a
                href="/contactUs"
                className="block text-lg text-white hover:text-gray-200 py-2 border-b border-gray-600 w-full text-center" // Added border
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
              {!isLoggedIn ? (
                <>
                  <a
                    href="/signup"
                    className="block text-lg cursor-pointer text-white hover:text-gray-200 py-2 border-b border-gray-600 w-full text-center" // Added border
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Signup
                  </a>
                  <a
                    href="/login"
                    className="block text-lg text-white hover:text-gray-200 py-2 border-b border-gray-600 w-full text-center" // Added border
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </a>
                </>
              ) : (
                <div>
                <button
                  className="block text-lg cursor-pointer text-white hover:text-gray-200 py-2 border-b border-gray-600 w-full text-center" // Added border
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                    navigate("/")
                  }}
                >
                  Logout
                </button>
                <a href="/dashboard" cl className="block text-lg cursor-pointer text-white hover:text-gray-200 py-2 border-b border-gray-600 w-full text-center">Profile</a>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section with Auto-Sliding Carousel */}
      <section className="relative h-[40vh] md:h-[60vh] bg-cover bg-center text-white flex items-center justify-center">
        <div className="relative w-full h-full overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`carousel-item absolute w-full h-full mt-1 transition-opacity ease-in-out duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={slide.src}
                className="w-full h-full object-cover"
                alt={slide.alt}
              />
              <div className="absolute inset-0 bg-black opacity-50"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <h2 className="text-xl md:text-5xl font-bold">{slide.title}</h2>
                <p className="text-sm md:text-xl mt-2 md:mt-4">
                  {slide.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section
        id="products"
        className="container mx-auto px-4 py-8 md:py-16 text-center bg-white"
        data-aos="fade-up"
      >
        <h3 className="text-2xl md:text-3xl font-semibold mb-6 md:mb-8">
          Our Products
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="card bg-white shadow-lg" data-aos="flip-left">
            <figure>
              <img
                src={veg}
                alt="Organic Vegetables"
                className="w-full h-32 md:h-48 object-cover hover:scale-125 transition-all ease-in-out duration-300"
              />
            </figure>
            <div className="card-body flex justify-center items-center">
              <h4 className="card-title text-sm md:text-lg">
                ORGANIC VEGETABLES
              </h4>
              <p className="text-xs md:text-base">
                Freshly harvested organic vegetables from local farms.
              </p>
              <div className="card-actions justify-center">
                <a
                  href="/vegetable"
                  className=" bg-[#004526] text-white py-2 px-4 rounded-lg hover:bg-[#004540] transition-all ease-in-out duration-700]"
                >
                  Explore
                </a>
              </div>
            </div>
          </div>
          <div className="card bg-white shadow-lg" data-aos="flip-left">
            <figure>
              <img
                src={fruits}
                alt="Fresh Fruits"
                className="w-full h-32 md:h-48 object-cover hover:scale-125 transition-all ease-in-out duration-300"
              />
            </figure>
            <div className="card-body flex justify-center items-center">
              <h4 className="card-title text-sm md:text-lg">FRESH FRUITS</h4>
              <p className="text-xs md:text-base">
                Juicy and delicious fruits picked at their peak ripeness.
              </p>
              <div className="card-actions justify-center">
                <a
                  href="/fruits"
                  className="bg-[#004526] text-white py-2 px-4 rounded-lg hover:bg-[#004540] transition-all ease-in-out duration-700"
                >
                  Explore
                </a>
              </div>
            </div>
          </div>
          <div className="card bg-white shadow-lg" data-aos="flip-left">
            <figure>
              <img
                src={dairy}
                alt="Dairy Products"
                className="w-full h-32 md:h-48 object-cover hover:scale-125 transition-all ease-in-out duration-300"
              />
            </figure>
            <div className="card-body flex items-center justify-center">
              <h4 className="card-title text-sm md:text-lg">GRAINS</h4>
              <p className="text-xs md:text-base">
                Fresh and organic grains sourced from local farms.
              </p>
              <div className="card-actions justify-center">
                <a
                  href="/grains"
                  className="bg-[#004526] text-white py-2 px-4 rounded-lg hover:bg-[#004540] transition-all ease-in-out duration-700"
                >
                  Explore
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="container mx-auto px-4 py-8 md:py-16 text-center"
        data-aos="fade-up"
      >
        <h3 className="text-2xl md:text-3xl font-semibold mb-6 md:mb-8">
          Get in Touch
        </h3>
        <p className="text-sm md:text-lg text-gray-700 max-w-2xl mx-auto">
          We would love to hear from you! Whether you have questions, feedback,
          or just want to say hello, feel free to reach out to us.
        </p>
        <div
          className="mt-8"
          onClick={() => {
            navigate("/contactUs");
          }}
        >
          <button className=" bg-[#004526] text-white py-2 px-4 rounded-lg hover:bg-[#004540] transition-all ease-in-out duration-700">
            Contact Us
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#004526] p-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between gap-4 md:gap-8">
          {/* Logo and Description */}
          <div className="flex flex-col items-center md:items-start">
            <img src={farm} alt="Logo" className="w-16 md:w-20 mb-4" />
            <p className="text-sm md:text-lg text-center md:text-left text-white">
              From our local farms to your table, we deliver freshness with
              every bite. <br />
              Sustainably sourced, organically grown, and always cared for.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col items-center md:items-start text-white">
            <h4 className="text-lg md:text-xl font-semibold mb-4">
              Quick Links
            </h4>
            <a
              href="/aboutUs"
              className="text-sm md:text-base hover:text-gray-200"
            >
              About Us
            </a>
            <a
              href="/products"
              className="text-sm md:text-base hover:text-gray-200"
            >
              Products
            </a>
            <a
              href="/contactUs"
              className="text-sm md:text-base hover:text-gray-200"
            >
              Contact
            </a>
          </div>

          {/* Contact and Social Media */}
          <div className="flex flex-col items-center md:items-start text-white">
            <h4 className="text-lg md:text-xl font-semibold mb-4">
              Contact Us
            </h4>
            <p className="text-sm md:text-base">
              Email:{" "}
              <a
                href="mailto:info@FarmToMarket.com"
                className="hover:text-gray-200"
              >
                info@FarmToMarket.com
              </a>
            </p>
            <p className="text-sm md:text-base">
              Phone:{" "}
              <a href="tel:+1234567890" className="hover:text-gray-200">
                +123 456 7890
              </a>
            </p>
            <div className="flex space-x-2 md:space-x-4 mt-4">
              <a href="#" className="text-gray-200 hover:text-white">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-200 hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-200 hover:text-white">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="container mx-auto text-center mt-4 md:mt-8">
          <p className="text-xs md:text-sm text-white">
            © {new Date().getFullYear()} FarmToMarket. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
