import cookieParser from "cookie-parser";
import { config } from "dotenv";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoute.js";
import miscRoute from "./routes/miscRoutes.js"

const app = express();

config();
app.use(
  cors({
    origin: [process.env.FRONTEND_URI],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1",miscRoute)

app.get("*", (req, res) => {
  res.status(404).json({
    message:"404! PAGE NOT FOUND"
  })
});

export default app;
