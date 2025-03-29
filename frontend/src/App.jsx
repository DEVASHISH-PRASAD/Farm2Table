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
import ResetPasswordPage from "./Pages/User/ResetPasswordPage";
import PreviousOrder from "./Pages/Cart/PreviousOrder";
import AnalyticsPage from "./Pages/Admin/AnalyticsPage";
import Page404 from "./Pages/Page404";
// Farmer Pages
import AddProduct from "./components/Farmer/AddProduct";
import UpdateStock from "./components/Farmer/UpdateStock";
import DeleteProduct from "./components/Farmer/DeleteProduct";
import ViewProducts from "./components/Farmer/ViewProducts";
import ViewOrdersReceived from "./components/Farmer/ViewOrdersReceived";
import UpdateProfileFarmer from "./components/Farmer/UpdateProfileFarmer";
// Wholesaler Pages
import PurchaseProduct from "./components/Wholesaler/PurchaseProduct";
import ViewOrderHistory from "./components/Wholesaler/ViewOrderHistory";
import ViewAvailableProducts from "./components/Wholesaler/ViewAvailableProducts";
import UpdateProfileWholesaler from "./components/Wholesaler/UpdateProfileWholesaler";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* Routes accessible to ADMIN, CUSTOMER, FARMER, WHOLESALER */}
        <Route
          element={
            <RequireAuth
              allowedRoles={["ADMIN", "CUSTOMER", "FARMER", "WHOLESALER"]}
            />
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/previous-order" element={<PreviousOrder />} />
        </Route>

        {/* Public Routes */}
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgotPassword" element={<RequestResetPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/vegetable" element={<VegetablesPage />} />
        <Route path="/fruits" element={<FruitsPage />} />
        <Route path="/grains" element={<GrainsPage />} />
        <Route path="/denied" element={<AccessDenied />} />

        {/* Admin Routes */}
        <Route element={<RequireAuth allowedRoles={["ADMIN"]} />}>
          <Route path="/createItem" element={<CreateItem />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route
            path="/adminUserManagement"
            element={<AdminUserManagement />}
          />
        </Route>

        {/* Farmer Routes */}
        <Route element={<RequireAuth allowedRoles={["FARMER"]} />}>
          <Route path="/farmer/add-product" element={<AddProduct />} />
          <Route path="/farmer/product/stock" element={<UpdateStock />} />
          <Route
            path="/farmer/product/:productId"
            element={<DeleteProduct />}
          />
          <Route path="/farmer/products" element={<ViewProducts />} />
          <Route path="/farmer/orders" element={<ViewOrdersReceived />} />
          <Route path="/farmer/profile" element={<UpdateProfileFarmer />} />
        </Route>

        {/* Wholesaler Routes */}
        <Route element={<RequireAuth allowedRoles={["WHOLESALER"]} />}>
          <Route path="/wholesaler/purchase" element={<PurchaseProduct />} />
          <Route path="/wholesaler/orders" element={<ViewOrderHistory />} />
          <Route
            path="/wholesaler/products"
            element={<ViewAvailableProducts />}
          />
          <Route
            path="/wholesaler/profile"
            element={<UpdateProfileWholesaler />}
          />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<Page404 />} />
      </Routes>
    </>
  );
}

export default App;
