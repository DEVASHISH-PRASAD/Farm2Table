import Item from "../models/productModel.js";
import AppError from "../utils/errorUtil.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";

/**
 * TO GET ALL PRODUCTS
 */

export const getAllItems = async function (req, res, next) {
    try {
      const { category } = req.query;
  
      if (!category) {
        return res.status(400).json({
          success: false,
          message: "Category is required",
        });
      }
  
      const items = await Item.find({ category });
  
      if (!items || items.length === 0) {
        return res.status(404).json({
          success: false,
          message: `No items found in the ${category} category`,
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Items retrieved successfully",
        items,
      });
    } catch (error) {
      return next(new AppError(error.message, 500));
    }
  };
  
/**
 * CREATE PRODUCT (ADMIN)
 */

export const createProduct = async (req, res, next) => {
  try {
    const { name, price, category, quantity, quantityType } = req.body;

    if (!name || !price || !category || !quantity || !quantityType) {
      return next(new AppError("All fields are required!", 400));
    }

    const item = new Item({
      name,
      category,
      price,
      quantity,
      soldInPieces: quantityType === "pieces",
      soldInDozen: quantityType === "dozen",
      soldByWeight: quantityType === "kg",
    });

    if (req.file) {
      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "F2M",
        });
        item.img = {
          public_id: result.public_id,
          secure_url: result.secure_url,
        };
        await item.save(); 

        // Remove the file from local storage
        await fs.rm(req.file.path);
      } catch (error) {
        await Item.findByIdAndDelete(item._id); // Cleanup item if upload fails
        return next(new AppError("File upload failed, please try again", 400));
      }
    }

    res.status(201).json({
      success: true,
      message: "Item added successfully!",
      item,
    });
  } catch (error) {
    return next(new AppError(error.message || "Failed to create item", 400));
  }
};

/**
 * UPDATE ITEMS BY ID
 */

export const updateItemById=async(req,res,next)=>{
    try {
        const {id} = req.params;
        const item = await Item.findByIdAndUpdate(
            id,{
                $set:req.body,
            },
            {
                runValidators:true
            }
        )
        if(!item){
            return next(new AppError("Item not found with this id",400))
        }
        res.status(200).json({
            success:true,
            message:"Item updated successfully!!"
    
        })
    } catch (error) {
        return next(new AppError(error.message, 400));
    }
}

/**
 * UPDATE ITEM QUANTITY BY ID (ADMIN)
 */

export const updateProductQuantity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;  // Extract the quantity from the request body
    
    if (quantity < 0 || isNaN(quantity)) {
      return next(new AppError("Quantity must be a valid number and cannot be negative", 400));
    }

    // Find the item by ID and update its quantity
    const item = await Item.findByIdAndUpdate(
      id,
      {
        $set: { quantity }  // Update only the quantity field
      },
      {
        new: true,  // To return the updated document
        runValidators: true
      }
    );

    if (!item) {
      return next(new AppError("Item not found with this id", 400));
    }

    res.status(200).json({
      success: true,
      message: "Item quantity updated successfully!",
      item,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

/**
 * UPDATE PRODUCT PRICE (ADMIN ONLY)
 */
export const updateProductPrice = async (req, res) => {
  const { price } = req.body;
  const { id } = req.params;  // Correctly destructure 'id' from req.params

  try {
    // Find the product by its ID
    const product = await Item.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Validate price
    if (price <= 0) {
      return res.status(400).json({ message: 'Price must be greater than 0' });
    }

    // Update the price of the product
    product.price = price;
    await product.save();

    res.status(200).json({ message: 'Product price updated successfully', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateStockAfterPurchase = async (req, res) => {
  try {
    const { items } = req.body;

    for (const item of items) {
      const product = await Item.findOne({ name: item.name });

      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: `Product ${item.name} not found` });
      }

      if (product.quantity < item.weight) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.name}`,
        });
      }

      product.quantity -= item.weight;
      await product.save();
    }

    res
      .status(200)
      .json({ success: true, message: "Stock updated successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Stock update failed", error });
  }
};
