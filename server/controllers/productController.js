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
      const { name, price, category, quantity } = req.body;
      if (!name || !price || !category || !quantity) {
        return next(new AppError("All fields are required!", 400));
      }
  
      const item = await Item.create({
        name,
        price,
        category,
        quantity,
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