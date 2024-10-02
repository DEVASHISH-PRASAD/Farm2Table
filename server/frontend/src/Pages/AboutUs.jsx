import React, { useEffect } from "react";
import AOS from "aos";
import Header from "./Header";
import Footer from "./Footer";

const AboutUs = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      mirror: false,
    });
  }, []);

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
        <section
          className="container mx-auto px-4 py-8 md:py-16 text-center"
          data-aos="fade-up"
        >
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">About Us</h2>
          <p className="text-sm md:text-lg text-gray-700 max-w-3xl mx-auto mb-8">
            Welcome to FarmToMarket, where we connect local farmers with
            consumers who value fresh, organic produce. Our mission is to
            promote sustainability, support local economies, and provide
            transparency in the food we eat. We are committed to delivering the
            freshest produce directly from the farm to your table, ensuring
            quality and care every step of the way.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="bg-white p-6 rounded-lg shadow-md" data-aos="fade-right">
              <h3 className="text-lg md:text-xl font-semibold mb-4">Our Mission</h3>
              <p className="text-sm md:text-base text-gray-700">
                Our mission is to bridge the gap between local farmers and
                consumers by offering fresh, organic produce while promoting
                sustainable farming practices and supporting local communities.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md" data-aos="fade-left">
              <h3 className="text-lg md:text-xl font-semibold mb-4">Our Vision</h3>
              <p className="text-sm md:text-base text-gray-700">
                We envision a world where every individual has access to
                nutritious, locally-sourced food, and where farmers are
                empowered to grow their businesses while preserving the
                environment.
              </p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
