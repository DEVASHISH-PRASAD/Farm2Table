import Order from "../../models/orderModel.js";
import User from "../../models/userModel.js";
import Item from "../../models/productModel.js";

// Route to get User signups per month
export const userSignups = async (req, res) => {
  const { year, month } = req.query;

  try {
    const monthlySignups = await User.aggregate([
      {
        $project: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
      },
      {
        $match: {
          ...(year && { year: parseInt(year) }), // Filter by year if provided
          ...(month && { month: parseInt(month) }), // Filter by month if provided
        },
      },
      {
        $group: {
          _id: { year: "$year", month: "$month" },
          totalSignups: { $count: {} },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);
    console.log("Aggregated monthly signups:", monthlySignups);
    res.status(200).json({ success: true, data: monthlySignups });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Route to get total orders and sales per month
export const orderSales = async (req, res) => {
  const { year, month } = req.query;

  try {
    const monthlyOrdersSales = await Order.aggregate([
      {
        $project: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          totalAmount: 1,
        },
      },
      {
        $match: {
          ...(year && { year: parseInt(year) }),
          ...(month && { month: parseInt(month) }),
        },
      },
      {
        $group: {
          _id: { year: "$year", month: "$month" },
          totalSales: { $sum: "$totalAmount" },
          orderCount: { $count: {} },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);
    console.log("Aggregated monthly sales:", monthlyOrdersSales);
    res.status(200).json({ success: true, data: monthlyOrdersSales });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Route to get total sales per item per month
export const itemSales = async (req, res) => {
  const { year, month } = req.query;

  try {
    const monthlyItemSales = await Order.aggregate([
      { $unwind: "$items" },
      {
        $project: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          itemName: "$items.name",
          itemPrice: {
            $convert: {
              input: "$items.price",
              to: "double",
              onError: 0,
              onNull: 0,
            },
          },
          itemWeight: {
            $convert: {
              input: "$items.weight",
              to: "double",
              onError: 0,
              onNull: 0,
            },
          },
        },
      },
      {
        $match: {
          ...(year && { year: parseInt(year) }),
          ...(month && { month: parseInt(month) }),
        },
      },
      {
        $group: {
          _id: { year: "$year", month: "$month", itemName: "$itemName" },
          totalSales: { $sum: { $multiply: ["$itemPrice", "$itemWeight"] } },
          itemCount: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);
    console.log("Aggregated monthly item sales:", monthlyItemSales);
    res.status(200).json({ success: true, data: monthlyItemSales });
  } catch (error) {
    console.error("Item Sales Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Route to get total sales per month for each item
export const monthlySales = async (req, res) => {
  const { year, month } = req.query;

  try {
    const monthlySales = await Item.aggregate([
      {
        $project: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          price: {
            $convert: { input: "$price", to: "double", onError: 0, onNull: 0 },
          },
          quantity: {
            $convert: { input: "$quantity", to: "int", onError: 0, onNull: 0 },
          },
        },
      },
      {
        $match: {
          ...(year && { year: parseInt(year) }),
          ...(month && { month: parseInt(month) }),
        },
      },
      {
        $group: {
          _id: { year: "$year", month: "$month" },
          totalSales: { $sum: { $multiply: ["$price", "$quantity"] } },
          itemCount: { $sum: "$quantity" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);
    console.log("Aggregated monthly sales:", monthlySales);
    res.status(200).json({ success: true, data: monthlySales });
  } catch (error) {
    console.error("Monthly Sales Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
