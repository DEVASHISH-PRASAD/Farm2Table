import React from "react";
import farm from "../assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-[#004526] text-white p-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between gap-4 md:gap-8">
        {/* Logo and Description */}
        <div className="flex flex-col items-center md:items-start">
          <img src={farm} alt="Logo" className="w-16 md:w-20 mb-4 " />
          <p className="text-sm md:text-lg text-center md:text-left">
            From our local farms to your table, we deliver freshness with every
            bite. <br />
            Sustainably sourced, organically grown, and always cared for.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col items-center md:items-start">
          <h4 className="text-lg md:text-xl font-semibold mb-4">Quick Links</h4>
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
        <div className="flex flex-col items-center md:items-start">
          <h4 className="text-lg md:text-xl font-semibold mb-4">Contact Us</h4>
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
  );
};

export default Footer;
