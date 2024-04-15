import { validationResult } from "express-validator";
import { body } from "express-validator";

export const validationResultExpress = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ ok: false, errors: errors.array() });
  }

  next();
};

export const bodyRegisterValidator = [
  body("email", "Formato de email incorrecto")
    .trim()
    .isEmail()
    .normalizeEmail(),
  body("password", "Necesarios mínimo 6 caracteres")
    .trim()
    .isLength({ min: 6 }),
  body("password", "Las contraseñas introducidas no coinciden").custom(
    (value, { req }) => {
      if (value !== req.body.confirmPassword) {
        throw new Error("Los passwords no coinciden");
      } else {
        return value;
      }
    }
  ),
  validationResultExpress,
];
