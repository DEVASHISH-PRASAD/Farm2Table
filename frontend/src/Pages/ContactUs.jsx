import React, { useEffect, useState } from "react";
import AOS from "aos";
import Header from "./Header";
import Footer from "./Footer";
import toast from "react-hot-toast";
import axiosInstance from "../Helpers/axiosInstance.js";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix the default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const ContactUs = () => {
  const [userInput, setUserInput] = useState({
    name: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      mirror: false,
    });
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserInput({ ...userInput, [name]: value });
  };

  async function onFormSubmit(e) {
    e.preventDefault();
    if (!userInput.email || !userInput.name || !userInput.message) {
      toast.error("All fields are mandatory!!");
      return;
    }
    try {
      const response = axiosInstance.post("/contact", userInput);
      toast.promise(response, {
        loading: "Submitting your message",
        success: "Form submitted successfully",
        error: "Failed to submit the form",
      });
      const contactResponse = await response;
      if (contactResponse?.data?.success) {
        setUserInput({
          name: "",
          email: "",
          message: "",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Operation Failed");
    }
  }

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
        <section
          className="container mx-auto px-4 py-8 md:py-16 md:w-1/2"
          data-aos="fade-up"
        >
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center">
            Get in Touch
          </h2>
         
          <form
            className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-md"
            onSubmit={onFormSubmit}
          >
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 text-start">
                Name
              </label>
              <input
                type="text"
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                placeholder="Your Name"
                name="name"
                value={userInput.name} 
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 text-start">
                Email
              </label>
              <input
                type="email"
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                placeholder="Your Email"
                name="email"
                value={userInput.email} 
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 text-start">
                Message
              </label>
              <textarea
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                placeholder="Your Message"
                rows="5"
                name="message"
                value={userInput.message} 
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-[#004526] text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors duration-300"
            >
              Send Message
            </button>
          </form>
        </section>

        {/* Map Section */}
        <div className="md:w-1/2 m-3 rounded-lg overflow-hidden shadow-md border-gray-400">
          <MapContainer 
            center={[28.6139, 77.2090]} 
            zoom={30} 
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[28.6139, 77.2090]}>
              <Popup>
                Our Location <br /> We are here.
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactUs;
