import cookieParser from "cookie-parser";
import { config } from "dotenv";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import path from "path";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoute.js";
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

app.get("/", (req, res) => {
  app.use(express.static(path.resolve(__dirname, "frontend", "dist")));
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

app.all("*", (req, res) => {
  res.status(404).send("OOPS! Page Not Found!!");
});

export default app;
