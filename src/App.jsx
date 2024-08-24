// src/App.jsx
import React, { useEffect } from "react";
import HomePage from "./Pages/HomePage";
import "aos/dist/aos.css"; // This import is crucial to include AOS styles
import Signup from "./Pages/Signup";
import { Route, Routes } from "react-router-dom";
import VegetablesPage from "./Pages/VegetablePage";
import CartPage from "./Pages/CartPage";
import FruitsPage from "./Pages/FruitsPage";
import GrainsPage from "./Pages/GrainsPage";
import ContactUs from "./Pages/ContactUs";
import ProductPage from "./Pages/ProductPage";
import AboutUs from "./Pages/AboutUs";
import LoginPage from "./Pages/LoginPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/aboutUs" element={<AboutUs />}></Route>
        <Route path="/products" element={<ProductPage />}></Route>
        <Route path="/contactUs" element={<ContactUs />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/vegetable" element={<VegetablesPage />}></Route>
        <Route path="/fruits" element={<FruitsPage />}></Route>
        <Route path="/grains" element={<GrainsPage />}></Route>
        <Route path="/cart" element={<CartPage />}></Route>
      </Routes>
    </>
  );
}

export default App;
