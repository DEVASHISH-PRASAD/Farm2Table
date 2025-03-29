import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import AppError from "../utils/errorUtil.js";

/**
 * PURCHASE PRODUCT
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export const purchaseProduct = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const wholesalerId = req.user.id;

    // Fetch product details
    const product = await Product.findById(productId);
    if (!product) return next(new AppError("Product not found!", 404));
    if (product.stock < quantity)
      return next(new AppError("Insufficient stock!", 400));

    // Calculate total price
    const totalPrice = product.price * quantity;

    // Create order
    const order = await Order.create({
      wholesaler: wholesalerId,
      product: productId,
      quantity,
      totalPrice,
      status: "PENDING",
    });

    // Reduce stock
    product.stock -= quantity;
    await product.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order,
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

/**
 * VIEW ORDER HISTORY
 */
export const getOrderHistory = async (req, res, next) => {
  try {
    const wholesalerId = req.user.id;
    const orders = await Order.find({ wholesaler: wholesalerId }).populate(
      "product"
    );

    res.status(200).json({
      success: true,
      message: "Order history retrieved successfully!",
      orders,
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

/**
 * VIEW AVAILABLE PRODUCTS
 */
export const getAvailableProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ stock: { $gt: 0 } });
    res.status(200).json({
      success: true,
      message: "Products retrieved successfully!",
      products,
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

/**
 * UPDATE PROFILE
 */
export const updateProfile = async (req, res, next) => {
  try {
    const wholesalerId = req.user.id;
    const { fullname, phone, location } = req.body;

    const wholesaler = await User.findByIdAndUpdate(
      wholesalerId,
      { fullname, phone, location },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      wholesaler,
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};
