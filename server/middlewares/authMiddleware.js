import JWT from "jsonwebtoken";
import AppError from "../utils/errorUtil.js";

const isLoggedIn = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new AppError("Unauthenticated ,Please Login again!!", 404));
  }
  const userDetails = await JWT.verify(token, process.env.JWT_SECRET);
  req.user = userDetails;
  next();
};

export { isLoggedIn };
