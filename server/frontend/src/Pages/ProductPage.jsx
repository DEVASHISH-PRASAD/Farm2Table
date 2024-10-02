import AOS from "aos";
import veg from "../assets/veg.jpeg";
import fruits from "../assets/fruits.jpeg";
import dairy from "../assets/dairy.jpeg";
import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

const ProductPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: false,
    });
  });
  return (
    <div>
      <Header />
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

      <Footer />
    </div>
  );
};

export default ProductPage;
