import Farmer from "../models/farmerModel.js";
import UserData from "../models/userModel.js";
import Order from "../models/orderModel.js";
import AppError from "../utils/errorUtil.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";

// Generate unique orderId
const generateOrderId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `ORD-${timestamp}-${random}`;
};

// Add a new product (unchanged)
export const addProduct = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return next(new AppError("Authentication required or invalid user", 401));
    }

    const user = await UserData.findById(userId).select("+role");
    if (!user || user.role !== "FARMER") {
      return next(new AppError("Only farmers can add products", 403));
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
    if (parsedPrice <= 0 || parsedQuantity < 0) {
      return next(
        new AppError(
          "Price must be positive and quantity cannot be negative",
          400
        )
      );
    }

    const normalizedCategory = category.toLowerCase();
    if (!["fruits", "grains", "vegetables"].includes(normalizedCategory)) {
      return next(new AppError("Invalid category", 400));
    }

    let farmer = await Farmer.findOne({ user: userId });
    if (!farmer) {
      farmer = await Farmer.create({
        user: userId,
        farmName: `${user.fullname}'s Farm`,
        farmSize: 1.0,
        location: { type: "Point", coordinates: [0.0, 0.0] },
        certifications: [],
      });
    }

    if (farmer.products.some((product) => product.name === name)) {
      return next(new AppError("Product name already exists", 400));
    }

    const newProduct = {
      name,
      price: parsedPrice,
      quantity: parsedQuantity,
      category: normalizedCategory,
      description: description || "",
    };

    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "F2M",
        });
        newProduct.img = {
          public_id: result.public_id,
          secure_url: result.secure_url,
        };
        await fs.rm(req.file.path);
      } catch (error) {
        if (req.file.path) {
          await fs
            .rm(req.file.path)
            .catch((err) => console.error("Failed to delete local file:", err));
        }
        return next(new AppError("File upload failed, please try again", 400));
      }
    }

    farmer.products.push(newProduct);
    await farmer.save();

    const addedProduct = farmer.products[farmer.products.length - 1];

    res.status(201).json({
      status: "success",
      data: { product: addedProduct },
    });
  } catch (error) {
    if (req.file?.path) {
      await fs
        .rm(req.file.path)
        .catch((err) => console.error("Failed to delete local file:", err));
    }
    next(new AppError(error.message || "Failed to add product", 400));
  }
};

// Delete a product (unchanged)
export const deleteProduct = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const productId = req.params.productId;

    if (!userId) {
      return next(new AppError("Authentication required or invalid user", 401));
    }

    const user = await UserData.findById(userId).select("+role");
    if (!user || user.role !== "FARMER") {
      return next(new AppError("Only farmers can delete products", 403));
    }

    const farmer = await Farmer.findOne({ user: userId });
    if (!farmer) {
      return next(new AppError("Farmer not found", 404));
    }

    const product = farmer.products.id(productId);
    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    const activeOrders = await Order.find({
      "items.name": product.name,
      status: "Pending",
      deliveryStatus: "Not Dispatched",

    });

    if (activeOrders.length > 0) {
      return next(
        new AppError(
          "Cannot delete product with pending orders. Cancel the orders first.",
          400
        )
      );
    }

    if (product.img?.public_id) {
      try {
        await cloudinary.uploader.destroy(product.img.public_id);
      } catch (error) {
        console.error("Failed to delete Cloudinary image:", error);
      }
    }

    farmer.products.pull(productId);
    await farmer.save();

    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(new AppError(error.message || "Failed to delete product", 400));
  }
};

// Update farmer profile (unchanged)
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return next(new AppError("Authentication required or invalid user", 401));
    }

    const user = await UserData.findById(userId).select("+role");
    if (!user || user.role !== "FARMER") {
      return next(new AppError("Only farmers can update their profile", 403));
    }

    const { farmName, farmSize, location, certifications } = req.body;

    if (!farmName || !farmSize || !location) {
      return next(
        new AppError(
          "Missing required fields: farmName, farmSize, location",
          400
        )
      );
    }

    const parsedFarmSize = parseFloat(farmSize);
    if (isNaN(parsedFarmSize) || parsedFarmSize <= 0) {
      return next(new AppError("Farm size must be a positive number", 400));
    }

    if (
      !location.type ||
      location.type !== "Point" ||
      !location.coordinates ||
      location.coordinates.length !== 2
    ) {
      return next(
        new AppError("Invalid location format. Must be a GeoJSON Point", 400)
      );
    }

    const [longitude, latitude] = location.coordinates;
    if (
      isNaN(latitude) ||
      isNaN(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return next(
        new AppError(
          "Invalid coordinates. Latitude must be -90 to 90, longitude -180 to 180",
          400
        )
      );
    }

    const farmer = await Farmer.findOne({ user: userId });
    if (!farmer) {
      return next(new AppError("Farmer not found", 404));
    }

    farmer.farmName = farmName;
    farmer.farmSize = parsedFarmSize;
    farmer.location = {
      type: "Point",
      coordinates: [longitude, latitude],
    };
    if (certifications) {
      farmer.certifications = Array.isArray(certifications)
        ? certifications
        : [certifications];
    }

    await farmer.save();

    res.status(200).json({
      status: "success",
      data: { farmer },
    });
  } catch (error) {
    next(new AppError(error.message || "Failed to update profile", 400));
  }
};

// Get farmer profile (unchanged)
export const getFarmerProfile = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return next(new AppError("Authentication required or invalid user", 401));
    }

    const user = await UserData.findById(userId).select("+role");
    if (!user || user.role !== "FARMER") {
      return next(new AppError("Only farmers can access their profile", 403));
    }

    const farmer = await Farmer.findOne({ user: userId });
    if (!farmer) {
      return next(new AppError("Farmer not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: { farmer },
    });
  } catch (error) {
    next(new AppError(error.message || "Failed to fetch profile", 400));
  }
};

// Update product stock (unchanged)
export const updateStock = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { productId, stock } = req.body;

    if (!userId) {
      return next(new AppError("Authentication required or invalid user", 401));
    }

    const user = await UserData.findById(userId).select("+role");
    if (!user || user.role !== "FARMER") {
      return next(new AppError("Only farmers can update stock", 403));
    }

    if (!productId || stock === undefined) {
      return next(
        new AppError("Missing required fields: productId, stock", 400)
      );
    }

    const parsedStock = parseFloat(stock);
    if (isNaN(parsedStock) || parsedStock < 0) {
      return next(new AppError("Stock must be a non-negative number", 400));
    }

    const farmer = await Farmer.findOne({ user: userId });
    if (!farmer) {
      return next(new AppError("Farmer not found", 404));
    }

    const product = farmer.products.id(productId);
    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    product.quantity = parsedStock;
    await farmer.save();

    res.status(200).json({
      status: "success",
      data: { product },
    });
  } catch (error) {
    next(new AppError(error.message || "Failed to update stock", 400));
  }
};

// Get orders received (unchanged)
export const getOrdersReceived = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return next(new AppError("Authentication required or invalid user", 401));
    }

    const user = await UserData.findById(userId).select("+role");
    if (!user || user.role !== "FARMER") {
      return next(new AppError("Only farmers can view their orders", 403));
    }

    const farmer = await Farmer.findOne({ user: userId });
    if (!farmer) {
      return next(new AppError("Farmer not found", 404));
    }

    const productNames = farmer.products.map((product) => product.name);

    const orders = await Order.find({
      "items.name": { $in: productNames },
    })
      .populate("user", "fullname email")
      .lean();

    res.status(200).json({
      status: "success",
      data: { orders },
    });
  } catch (error) {
    next(new AppError(error.message || "Failed to fetch orders", 400));
  }
};

// Update order delivery status (unchanged)
export const updateOrderDeliveryStatus = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { orderId, deliveryStatus } = req.body;

    if (!userId) {
      return next(new AppError("Authentication required or invalid user", 401));
    }

    const user = await UserData.findById(userId).select("+role");
    if (!user || user.role !== "FARMER") {
      return next(new AppError("Only farmers can update delivery status", 403));
    }

    if (!orderId || !deliveryStatus) {
      return next(
        new AppError("Missing required fields: orderId, deliveryStatus", 400)
      );
    }

    if (
      ![
        "Not Dispatched",
        "Shipped",
        "In Transit",
        "Out for Delivery",
        "Delivered",
      ].includes(deliveryStatus)
    ) {
      return next(new AppError("Invalid delivery status", 400));
    }

    const farmer = await Farmer.findOne({ user: userId });
    if (!farmer) {
      return next(new AppError("Farmer not found", 404));
    }

    const order = await Order.findOne({ orderId });
    if (!order) {
      return next(new AppError("Order not found", 404));
    }

    const productNames = farmer.products.map((p) => p.name);
    const hasFarmerProduct = order.items.some((item) =>
      productNames.includes(item.name)
    );
    if (!hasFarmerProduct) {
      return next(
        new AppError("You are not authorized to update this order", 403)
      );
    }

    order.deliveryStatus = deliveryStatus;
    if (deliveryStatus === "Delivered") {
      order.delivered = true;
    } else if (order.delivered) {
      order.delivered = false;
    }

    await order.save();

    res.status(200).json({
      status: "success",
      data: { order },
    });
  } catch (error) {
    next(
      new AppError(error.message || "Failed to update delivery status", 400)
    );
  }
};

// Get farmer's products (unchanged)
export const getMyProducts = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return next(new AppError("Authentication required or invalid user", 401));
    }

    const user = await UserData.findById(userId).select("+role");
    if (!user || user.role !== "FARMER") {
      return next(new AppError("Only farmers can view their products", 403));
    }

    const farmer = await Farmer.findOne({ user: userId });
    if (!farmer) {
      return next(new AppError("Farmer not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: { products: farmer.products },
    });
  } catch (error) {
    next(new AppError(error.message || "Failed to fetch products", 400));
  }
};

// Get all farmer products (for admin)
export const getAllFarmerProducts = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return next(new AppError("Authentication required or invalid user", 401));
    }

    const user = await UserData.findById(userId).select("+role");
    if (!user || user.role !== "ADMIN") {
      return next(
        new AppError("Only admins can view all farmer products", 403)
      );
    }

    const farmers = await Farmer.find()
      .populate("user", "fullname email")
      .lean();

    const products = farmers.flatMap((farmer) =>
      farmer.products.map((product) => ({
        ...product,
        farmerId: farmer._id,
        farmerName: farmer.farmName,
        farmerUser: farmer.user.fullname,
        farmerEmail: farmer.user.email,
      }))
    );

    res.status(200).json({
      status: "success",
      data: { products },
    });
  } catch (error) {
    next(new AppError(error.message || "Failed to fetch products", 400));
  }
};

// Create admin order
export const createAdminOrder = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return next(new AppError("Authentication required or invalid user", 401));
    }

    const user = await UserData.findById(userId).select("+role");
    if (!user || user.role !== "ADMIN") {
      return next(new AppError("Only admins can create orders", 403));
    }

    const {
      userId: orderUserId,
      productId,
      farmerId,
      quantity,
      paymentMethod,
    } = req.body;
    if (
      !orderUserId ||
      !productId ||
      !farmerId ||
      !quantity ||
      !paymentMethod
    ) {
      return next(new AppError("Missing required fields", 400));
    }

    const parsedQuantity = parseFloat(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      return next(new AppError("Quantity must be a positive number", 400));
    }

    if (
      ![
        "Credit Card",
        "Debit Card",
        "Net Banking",
        "UPI",
        "Cash on Delivery",
      ].includes(paymentMethod)
    ) {
      return next(new AppError("Invalid payment method", 400));
    }

    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return next(new AppError("Farmer not found", 404));
    }

    const product = farmer.products.id(productId);
    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    if (product.quantity < parsedQuantity) {
      return next(new AppError("Insufficient stock", 400));
    }

    const orderUser = await UserData.findById(orderUserId);
    if (!orderUser) {
      return next(new AppError("User not found", 404));
    }

    product.quantity -= parsedQuantity;
    await farmer.save();

    const order = await Order.create({
      orderId: generateOrderId(),
      user: orderUserId,
      items: [
        {
          name: product.name,
          price: product.price,
          weight: parsedQuantity,
        },
      ],
      totalAmount: product.price * parsedQuantity,
      status: "Pending",
      deliveryStatus: "Not Dispatched",
      paymentMethod,
      createdAt: new Date(),
    });

    res.status(201).json({
      status: "success",
      data: { order },
    });
  } catch (error) {
    next(new AppError(error.message || "Failed to create order", 400));
  }
};

// Get all users (for admin order form)
export const getAllUsers = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return next(new AppError("Authentication required or invalid user", 401));
    }

    const user = await UserData.findById(userId).select("+role");
    if (!user || user.role !== "ADMIN") {
      return next(new AppError("Only admins can view users", 403));
    }

    const users = await UserData.find({ role: { $ne: "ADMIN" } })
      .select("fullname email _id")
      .lean();

    res.status(200).json({
      status: "success",
      data: { users },
    });
  } catch (error) {
    next(new AppError(error.message || "Failed to fetch users", 400));
  }
};
