import jwt from "jsonwebtoken";
import { tokenVerificationError } from "../utils/tokenManager.js";

export const requireRefreshToken = (req, res, next) => {
  try {
    const refreshTokenJWT = req.query.refreshTokenJWT;
    if (!refreshTokenJWT) throw new Error("No existe el token");

    const { uid, email, role } = jwt.verify(
      refreshTokenJWT,
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
