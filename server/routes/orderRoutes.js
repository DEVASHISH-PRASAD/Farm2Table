import express from 'express';
import { createOrder, verifyPayment, getUserOrders } from '../controllers/orderController.js';

const router = express.Router();

router.post('/create-order', createOrder);
router.post('/verify-payment', verifyPayment);
router.get('/user/:userId', getUserOrders);

export default router;
