import app from "./app.js";
import connectToDb from "./config/db.js";
import { v2 } from "cloudinary";
import Razorpay from "razorpay";
const Port = process.env.PORT ||3001 ;


v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

app.listen(Port, async () => {
  await connectToDb();
  console.log(`Server is listening on port:${Port}`);
});
