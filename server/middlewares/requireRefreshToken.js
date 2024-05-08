import jwt from "jsonwebtoken";
import { tokenVerificationError } from "../utils/tokenManager.js";

export const requireRefreshToken = (req, res, next) => {
  try {
    console.log(req.cookies);
    const refreshTokenCookie = req.cookies?.refreshToken;
    if (!refreshTokenCookie) throw new Error("No existe el token");

    const { uid, email, role } = jwt.verify(
      refreshTokenCookie,
      process.env.JWT_REFRESH
    );

    req.uid = uid;
    req.email = email;
    req.role = role;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: tokenVerificationError[error.message] });
  }
};
