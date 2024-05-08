import jwt from "jsonwebtoken";

export const generateToken = (uid, email, role) => {
  const expiresIn = 60 * 5;

  try {
    const token = jwt.sign({ uid, email, role }, process.env.JWT_SECRET, {
      expiresIn,
    });

    return { token, expiresIn };
  } catch (err) {
    console.log(err);
  }
};

export const generateRefreshToken = (uid, email, role, res) => {
  const expiresIn = 60 * 60 * 24 * 30;

  try {
    const refreshToken = jwt.sign(
      { uid, email, role },
      process.env.JWT_REFRESH,
      {
        expiresIn,
      }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.MODO === "production",
      expires: new Date(Date.now() + expiresIn * 1000),
    });
  } catch (err) {
    console.log(err);
  }
};

export const tokenVerificationError = {
  "Invalid signature": "La firma del JWT no es válida",
  "jwt expired": "El JWT ha expirado",
  "jwt malformed": "El JWT no tiene el formato correcto",
  "invalid token": "El JWT no es válido",
  "No Bearer": "Debes utilizar el formato Bearer",
};
