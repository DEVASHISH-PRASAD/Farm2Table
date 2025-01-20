import express from 'express';
import { createOrder, verifyPayment, getUserOrders } from '../controllers/orderController.js';

const router = express.Router();

// Route to create an order
router.post('/create-order', createOrder);

// Route to verify payment after successful Razorpay payment
router.post('/verify-payment', verifyPayment);

// Route to get all orders of a user
router.get('/user/:userId', getUserOrders);

export default router;
