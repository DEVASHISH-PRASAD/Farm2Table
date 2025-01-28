import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import store from "./Redux/store.js";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    
  <BrowserRouter>
  <GoogleOAuthProvider clientId="860336309878-8ff21gmiv94eb3gtt805jjcadufe5ssu.apps.googleusercontent.com">
    <App />
    <Toaster />
    </GoogleOAuthProvider>
  </BrowserRouter>
  </Provider>
);
