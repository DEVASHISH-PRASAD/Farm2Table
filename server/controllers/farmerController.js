import Farmer from "../models/farmerModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import AppError from "../utils/errorUtil.js";

/**
 * ADD PRODUCT
 */
export const addProduct = async (req, res, next) => {
  try {
    const { name, price, stock, category, description } = req.body;
    const farmer = await Farmer.findOne({ user: req.user.id });

    if (!farmer) return next(new AppError("Farmer profile not found!", 404));

    const product = await Product.create({
      name,
      price,
      stock,
      category,
      description,
    });

    farmer.products.push(product._id);
    await farmer.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully!",
      product,
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

/**
 * UPDATE PRODUCT STOCK
 */
export const updateStock = async (req, res, next) => {
  try {
    const { productId, stock } = req.body;
    const farmer = await Farmer.findOne({ user: req.user.id }).populate(
      "products"
    );

    if (!farmer) return next(new AppError("Farmer profile not found!", 404));

    const product = farmer.products.find((p) => p._id.toString() === productId);
    if (!product) return next(new AppError("Product not found!", 404));

    product.stock = stock;
    await product.save();

    res.status(200).json({
      success: true,
      message: "Stock updated successfully!",
      product,
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

/**
 * DELETE PRODUCT
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const farmer = await Farmer.findOne({ user: req.user.id });

    if (!farmer) return next(new AppError("Farmer profile not found!", 404));

    farmer.products = farmer.products.filter((p) => p.toString() !== productId);
    await farmer.save();

    await Product.findByIdAndDelete(productId);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully!",
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

/**
 * VIEW FARMER'S PRODUCTS
 */
export const getFarmerProducts = async (req, res, next) => {
  try {
    const farmer = await Farmer.findOne({ user: req.user.id }).populate(
      "products"
    );

    if (!farmer) return next(new AppError("Farmer profile not found!", 404));

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully!",
      products: farmer.products,
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

/**
 * VIEW ORDERS RECEIVED
 */
export const getOrdersReceived = async (req, res, next) => {
  try {
    const farmer = await Farmer.findOne({ user: req.user.id });

    if (!farmer) return next(new AppError("Farmer profile not found!", 404));

    const orders = await Order.find()
      .populate({
        path: "product",
        match: { _id: { $in: farmer.products } },
      })
      .populate("wholesaler");

    const filteredOrders = orders.filter((order) => order.product !== null);

    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully!",
      orders: filteredOrders,
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

/**
 * UPDATE FARMER PROFILE
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { farmName, farmSize, location } = req.body;
    const farmer = await Farmer.findOneAndUpdate(
      { user: req.user.id },
      { farmName, farmSize, location },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      farmer,
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};
