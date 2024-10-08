import React, { useEffect, useState } from "react";
import AOS from "aos";
import Header from "./Header";
import Footer from "./Footer";
import toast from "react-hot-toast";
import axiosInstance from "../Helpers/axiosInstance.js";

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
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
        <section
          className="container mx-auto px-4 py-8 md:py-16 text-center"
          data-aos="fade-up"
        >
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">
            Get in Touch
          </h2>
          <p className="text-sm md:text-lg text-gray-700 max-w-xl mx-auto mb-8">
            We would love to hear from you! Whether you have questions,
            feedback, or just want to say hello, feel free to reach out to us.
          </p>
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
      </div>
      <Footer />
    </div>
  );
};

export default ContactUs;
