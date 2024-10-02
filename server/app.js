import cookieParser from "cookie-parser";
import { config } from "dotenv";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import path from "path";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoute.js";
import { fileURLToPath } from "url";


const __filname = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filname)

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

app.use(express.static(path.join(__dirname,'/frontend/dist')))

app.get("*", (req, res) => {
res.sendFile(path.join(__dirname,'/frontend/dist/index.html'));
});

export default app;
