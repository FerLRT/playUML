import jwt from "jsonwebtoken";
import { tokenVerificationError } from "../utils/tokenManager.js";

export const requireToken = (req, res, next) => {
  try {
    let token = req.headers?.authorization;

    if (!token) throw new Error("No hay token");

    token = token.split(" ")[1];
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);

    req.uid = uid;

    next();
  } catch (err) {
    console.log(err.message);

    return res.status(401).send({ error: tokenVerificationError[err.message] });
  }
};
