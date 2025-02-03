import Order from '../models/orderModel.js';
import { razorpay } from '../server.js';
import crypto from 'crypto';

// 1️⃣ **Create a New Razorpay Order**
const createOrder = async (req, res) => {
  const { items, totalAmount, userId } = req.body;

  // Validate required fields
  if (!items || !totalAmount || !userId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Convert INR to paise (Razorpay requires amount in smallest currency unit)
    const options = {
      amount: totalAmount * 100,
      currency: 'INR',
      receipt: `order_${Date.now()}`,
    };

    // Create order on Razorpay
    const razorpayOrder = await razorpay.orders.create(options);

    // Create new order in the database
    const newOrder = new Order({
      orderId: razorpayOrder.id,
      user: userId,
      items: items.map((item) => ({
        name: item.name,
        price: item.price,
        weight: item.weight,
      })),
      totalAmount,
      status: 'Pending',
    });

    await newOrder.save();

    // Return order details to the frontend
    res.status(201).json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount / 100,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order, please try again.' });
  }
};


// 2️⃣ **Verify Payment with Razorpay Signature**
const verifyPayment = async (req, res) => {
  const { paymentId, orderId, signature } = req.body;

  try {
    if (!paymentId || !orderId || !signature) {
      return res.status(400).json({ error: 'Missing payment details' });
    }

    // Generate HMAC SHA256 signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    // Compare the generated signature with the received one
    if (generatedSignature !== signature) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    // Find the order in the database
    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Update order details after successful payment
    order.status = "Paid";
    order.paymentId = paymentId;
    await order.save();

    res.status(200).json({ success: true, message: "Payment verified successfully" });

  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// 3️⃣ **Fetch All Orders for a Specific User**
const getUserOrders = async (req, res) => {
  const userId = req.params.id;

  try {
    // Fetch orders & sort by date (newest first)
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean(); // Use .lean() for better performance
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};


// Export functions
export { createOrder, verifyPayment, getUserOrders };
