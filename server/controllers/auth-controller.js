import { authModel } from "../models/auth-model.js";
import { hashPassword, comparePassword } from "../utils/user-utils.js";

export class AuthController {
  static async signup(req, res) {
    const { email, password } = req.body;

    try {
      const hashedPassword = await hashPassword(password);
      const user = await authModel.create({ email, password: hashedPassword });
      res.status(201).json(user);
    } catch (error) {
      res.status(500).send("Internal Server Error: " + error.message);
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await authModel.findOne({ where: { email } });
      if (!user) {
        return res.status(401).send("Unauthorized");
      }
      const isMatch = await comparePassword(password, user.password);
      if (isMatch) {
        return res.status(200).json(user);
      } else {
        return res.status(401).send("Unauthorized");
      }
    } catch (error) {
      res.status(500).send("Internal Server Error: " + error.message);
    }
  }

  static logout(req, res) {
    res.status(200).send("OK");
  }
}
