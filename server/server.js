import app from "./app.js";
import connectToDb from "./config/db.js";
import { v2 } from "cloudinary";
const Port = process.env.PORT ||3001 ;


v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


app.listen(Port, async () => {
  await connectToDb();
  console.log(`Server is listening on port:${Port}`);
});
