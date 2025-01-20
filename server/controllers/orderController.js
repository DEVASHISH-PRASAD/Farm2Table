import Order from '../models/orderModel.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Razorpay instance


// 1. Create an Order
const createOrder = async (req, res) => {
  const { items, totalAmount, userId } = req.body;

  // Validate required fields
  if (!items || !totalAmount || !userId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Razorpay order options
    const options = {
      amount: totalAmount * 100, // Convert INR to paise (multiplying by 100)
      currency: 'INR',
      receipt: `order_${Date.now()}`, // Unique receipt ID
    };

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create(options);

    // Create and save order in the database
    const newOrder = new Order({
      orderId: razorpayOrder.id, // Razorpay's order ID
      user: userId, // User ID
      items: items.map((item) => ({
        name: item.name,
        price: item.price,
        weight: item.weight,
      })),
      totalAmount, // Total amount in INR
      status: 'Pending', // Initial status
    });

    await newOrder.save();

    // Respond with Razorpay order details
    res.status(201).json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount / 100, // Return amount in INR
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: 'Failed to create order, please try again.' });
  }
};

// Verify Payment with only paymentId
const verifyPayment = async (req, res) => {
    const { paymentId, orderId,signature } = req.body;
    // Generate the expected signature
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET) // Use Razorpay secret
      .update(body)
      .digest('hex');
  
    // Compare signatures
    if (signature === expectedSignature) {
      try {
        const order = await Order.findOne({ orderId });
  
        if (order) {
          // Update the order status to 'Paid' upon successful payment
          order.status = 'Paid';
          order.paymentId = paymentId;
          await order.save();
  
          res.status(200).json({ success: true, message: 'Payment Verified' });
        } else {
          console.error("Order not found for ID:", orderId);
          res.status(404).json({ error: 'Order not found' });
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ error: 'Payment verification failed' });
      }
    } else {
      console.error("Invalid payment signature:", signature, "Expected:", expectedSignature);
      res.status(400).json({ error: 'Invalid payment signature' });
    }
  };


// 3. Get All Orders of a User
const getUserOrders = async (req, res) => {
  const userId = req.params.userId;

  try {
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// Export all functions
export { createOrder, verifyPayment, getUserOrders };
