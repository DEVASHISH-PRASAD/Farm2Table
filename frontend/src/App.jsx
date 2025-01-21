// src/App.jsx
import React, { useEffect } from "react";
import HomePage from "./Pages/HomePage";
import "aos/dist/aos.css";
import Signup from "./Pages/Signup";
import { Route, Routes } from "react-router-dom";
import VegetablesPage from "./Pages/Products/VegetablePage";
import CartPage from "./Pages/CartPage";
import FruitsPage from "./Pages/Products/FruitsPage";
import GrainsPage from "./Pages/Products/GrainsPage";
import ContactUs from "./Pages/ContactUs";
import ProductPage from "./Pages/ProductPage";
import AboutUs from "./Pages/AboutUs";
import LoginPage from "./Pages/LoginPage";
import Dashboard from "./Pages/Dashboard";
import CreateItem from "./admin/CreateItem";
import AccessDenied from "./Pages/AccessDenied";
import RequireAuth from "./components/RequireAuth";
import AdminUserManagement from "./Pages/Admin/AdminUserManagement";
import RequestResetPasswordPage from "./Pages/User/RequestResetPasswordPage";
import ResetPasswordPage from "./Pages/User/ResetPasswordPage"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>

        <Route
          element={
            <RequireAuth allowedRoles={["ADMIN", "CUSTOMER", "FARMER"]} />
          }
        >
          <Route path="/dashboard" element={<Dashboard/>}></Route>
          <Route path="/cart" element={<CartPage />}></Route>
        </Route>

        <Route path="/aboutUs" element={<AboutUs />}></Route>
        <Route path="/products" element={<ProductPage />}></Route>
        <Route path="/contactUs" element={<ContactUs />}></Route>

        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/forgotPassword" element={<RequestResetPasswordPage />}></Route>
        <Route path="/reset-password" element={<ResetPasswordPage />}></Route>


        <Route path="/vegetable" element={<VegetablesPage />}></Route>
        <Route path="/fruits" element={<FruitsPage />}></Route>
        <Route path="/grains" element={<GrainsPage />}></Route>

        <Route path="/denied" element={<AccessDenied />}></Route>

          
        <Route element={<RequireAuth allowedRoles={["ADMIN"]} />}>
          <Route path="/createItem" element={<CreateItem />}></Route>
          <Route path="/adminUserManagement" element={<AdminUserManagement/>}></Route>
        </Route>
        
      </Routes>
    </>
  );
}

export default App;