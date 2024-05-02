import nodemailer from "nodemailer";
import { config } from "dotenv";

// Cargar las variables de entorno del archivo .env
config();

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendCredentialsEmail(email, password) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "PlayUML - Credenciales de usuario",
    text: `Aquí tienes tus credenciales de usuario:\n\nUsuario: ${email}\nContraseña: ${password}\n\nSaludos,\nPlayUML`,
  };

  try {
    // const info = await transporter.sendMail(mailOptions);
    console.log("Correo electrónico enviado:", mailOptions);
  } catch (error) {
    console.log("Error al enviar el correo electrónico:", error);
  }
}
