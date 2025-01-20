import JWT from "jsonwebtoken";
import AppError from "../utils/errorUtil.js";

/**
 * Middleware to check if the user is logged in
 */
const isLoggedIn = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new AppError("Unauthenticated. Please log in again!", 401));
  }

  try {
    const userDetails = JWT.verify(token, process.env.JWT_SECRET);
    req.user = userDetails; // Attach user details to the request object
    console.log("User Details:", userDetails);
    next();
  } catch (error) {
    // Handle token expiration or invalidity
    if (error.name === "TokenExpiredError") {
      res.cookie("token", null, {
        secure: process.env.NODE_ENV === "production",
        maxAge: 0,
        httpOnly: true,
        sameSite: "None",
      });

      return next(new AppError("Session expired. Please log in again.", 401));
    }

    return next(new AppError("Invalid token. Please log in again.", 401));
  }
};

/**
 * Middleware to authorize specific roles
 */
const authorizeRoles =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to access this resource.", 403)
      );
    }
    next();
  };

export { isLoggedIn, authorizeRoles };
