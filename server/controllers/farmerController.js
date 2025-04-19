import Farmer from "../models/farmerModel.js";
import Product from "../models/productModel.js"; // Corrected to Product
import Order from "../models/orderModel.js";
import AppError from "../utils/errorUtil.js";

export const addProduct = async (req, res, next) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Farmer ID from req.user:", req.user?.id);

    const farmerId = req.user?.id;
    if (!farmerId) {
      return next(new AppError("Authentication required or invalid user", 401));
    }

    const { name, price, quantity, category, description } = req.body;
    if (!name || !price || !quantity || !category) {
      return next(new AppError("Missing required fields", 400));
    }

    const parsedPrice = parseFloat(price);
    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedPrice) || isNaN(parsedQuantity)) {
      return next(new AppError("Price and quantity must be numbers", 400));
    }

    const normalizedCategory = category.toLowerCase();
    if (!["fruits", "grains", "vegetables"].includes(normalizedCategory)) {
      return next(new AppError("Invalid category", 400));
    }

    const product = await Product.create({
      name,
      price: parsedPrice,
      quantity: parsedQuantity,
      category: normalizedCategory,
      description: description || "",
      farmer: farmerId,
    });

    console.log("Created Product:", product);

    const farmer = await Farmer.findByIdAndUpdate(
      farmerId,
      { $push: { products: product._id } },
      { new: true, runValidators: true }
    );
    if (!farmer) {
      return next(new AppError("Farmer not found", 404));
    }

    res.status(201).json({
      status: "success",
      data: { product },
    });
  } catch (error) {
    console.error("Error Details:", error);
    next(new AppError(error.message || "Failed to add product", 400));
  }
};

// Update product stock
export const updateStock = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body; // Changed stock to quantity to match schema
    const farmerId = req.user.id;
    const product = await Product.findOneAndUpdate(
      { _id: productId, farmer: farmerId },
      { quantity }, // Updated to match schema field
      { new: true, runValidators: true }
    );
    if (!product) {
      return next(new AppError("Product not found or not authorized", 404));
    }
    res.status(200).json({ status: "success", data: { product } });
  } catch (error) {
    next(new AppError("Failed to update stock", 400));
  }
};

// Delete a product
export const deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const farmerId = req.user.id;

    const product = await Product.findOneAndDelete({
      // Corrected to Product
      _id: productId,
      farmer: farmerId,
    });

    if (!product) {
      return next(new AppError("Product not found or not authorized", 404));
    }

    await Farmer.findByIdAndUpdate(farmerId, {
      $pull: { products: productId },
    });

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(new AppError("Failed to delete product", 400));
  }
};

// Get all products added by the farmer
export const getFarmerProducts = async (req, res, next) => {
  try {
    const farmerId = req.user.id;
    const products = await Product.find({ farmer: farmerId });

    res.status(200).json({
      status: "success",
      results: products.length,
      data: { products },
    });
  } catch (error) {
    next(new AppError("Failed to fetch products", 400));
  }
};

// Get orders placed for farmer's products
export const getOrdersReceived = async (req, res, next) => {
  try {
    const farmerId = req.user.id;
    const products = await Product.find({ farmer: farmerId });
    const productIds = products.map((product) => product._id);
    const orders = await Order.find({ product: { $in: productIds } });

    res.status(200).json({
      status: "success",
      results: orders.length,
      data: { orders },
    });
  } catch (error) {
    next(new AppError("Failed to fetch orders", 400));
  }
};

// Update farmer profile
export const updateProfile = async (req, res, next) => {
  try {
    const farmerId = req.user.id;
    const { farmName, farmSize, location } = req.body;

    const farmer = await Farmer.findOneAndUpdate(
      { user: farmerId },
      { farmName, farmSize, location },
      { new: true, runValidators: true }
    );

    if (!farmer) return next(new AppError("Farmer profile not found", 404));

    res.status(200).json({
      status: "success",
      data: { farmer },
    });
  } catch (error) {
    next(new AppError("Failed to update profile", 400));
  }
};
