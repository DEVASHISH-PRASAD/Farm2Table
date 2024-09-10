import cookieParser from "cookie-parser";
import cors from 'cors'
import express from "express";
import morgan from "morgan";
const app = express();

app.use(
  cors({
    origin: [process.env.FRONTEND_URI],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.all("*", (req, res) => {
  res.status(404).send("OOPS! Page Not Found!!");
});

export default app;
