import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUpload } from "react-icons/fa";
import AOS from "aos";
import Header from "../Pages/Header.jsx";
import Footer from "../Pages/Footer.jsx";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { createItem } from "../Redux/Slices/ProductSlice.js"; // Assume you have a Redux slice for items

const CreateItem = () => {
  const [itemImage, setItemImage] = useState();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    image: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

const getImage = (event) => {
  event.preventDefault();
  const uploadedImage = event.target.files[0];

  if (uploadedImage) {
    if (uploadedImage.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error("File size exceeds 5MB.");
      return;
    }

    setFormData({ ...formData, image: uploadedImage });
    const fileReader = new FileReader();
    fileReader.readAsDataURL(uploadedImage);
    fileReader.addEventListener("load", function () {
      setItemImage(this.result);
    });
  }
};


  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: false,
    });
  }, []);

  const createNewItem = async (event) => {
    event.preventDefault();

    const fData = new FormData();
    fData.append("name", formData.name);
    fData.append("category", formData.category);
    fData.append("price", formData.price);
    fData.append("quantity", formData.quantity);
    fData.append("image", formData.image);

    const response = await dispatch(createItem(fData)).unwrap();
    if (response?.success) {
      toast.success("Item created successfully!");
      navigate("/products"); // Navigate to item listing or any other page
    } else {
      toast.error("Failed to create item.");
    }

    // Reset form
    setFormData({
      name: "",
      category: "",
      price: "",
      quantity: "",
      image: "",
    });
    setItemImage("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 ">
        <div
          className="card w-full max-w-lg shadow-lg bg-white p-8 rounded-xl mt-4 mb-4"
          data-aos="flip-left"
        >
          <button
            className="absolute top-4 left-4 text-gray-700 hover:text-gray-900 flex items-center"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <FaArrowLeft className="mr-2 mt-2 text-xl" />
          </button>
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Create New Item
          </h2>
          <form onSubmit={createNewItem}>
            <div className="form-control mb-4 text-center">
              <div className="flex flex-col items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={getImage}
                  id="itemImageUpload"
                  className="hidden"
                  name="img"
                />
                <label
                  htmlFor="itemImageUpload"
                  className="cursor-pointer flex flex-col items-center justify-center w-40 h-40 rounded-full border-4 border-gray-300 bg-black-50 relative"
                  aria-label="Upload item image"
                >
                  {itemImage ? (
                    <img
                      src={itemImage}
                      alt="Item Preview"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <>
                      <FaUpload className="text-gray-500 text-3xl" />
                      <span className="mt-2 text-gray-600">Upload Image</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className="form-control mb-4">
              <label className="label font-medium text-gray-700">
                <span className="label-text">Item Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input input-bordered w-full px-4 py-2"
                required
              />
            </div>

            <div className="form-control mb-4">
              <label className="label font-medium text-gray-700">
                <span className="label-text">Category</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="select select-bordered w-full px-4 py-2"
                required
              >
                <option value="" disabled>
                  Select a Category
                </option>
                <option value="fruits">Fruits</option>
                <option value="vegetables">Vegetables</option>
                <option value="grains">Grains</option>
              </select>
            </div>

            <div className="form-control mb-4">
              <label className="label font-medium text-gray-700">
                <span className="label-text">Price (₹)</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="input input-bordered w-full px-4 py-2"
                required
              />
            </div>

            <div className="form-control mb-4">
              <label className="label font-medium text-gray-700">
                <span className="label-text">Quantity (kg)</span>
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="input input-bordered w-full px-4 py-2"
                required
              />
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                className="bg-[#004526] text-white py-2 px-4 rounded-lg hover:bg-teal-700"
              >
                Create Item
              </button>
            </div>

            <div className="text-center mt-4">
              <p className="text-gray-600">
                Want to go back?{" "}
                <a href="/items" className="text-blue-500 hover:underline">
                  View Items
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateItem;
