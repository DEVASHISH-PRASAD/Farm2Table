import JWT from "jsonwebtoken";
import AppError from "../utils/errorUtil.js";

const isLoggedIn = async (req, res, next) => {
  const { token }  = req.cookies;
  
  if (!token) {
    return next(new AppError("Unauthenticated ,Please Login again!!", 404));
  }
  const userDetails = await JWT.verify(token, process.env.JWT_SECRET);
  req.user = userDetails;
  console.log(userDetails);
  
  next();
};

const authorizeRoles =
  (...roles) =>
  async (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to view this route", 403));
    }
    next();
  };
export { isLoggedIn,authorizeRoles };