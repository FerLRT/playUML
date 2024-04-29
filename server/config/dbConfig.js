import { Sequelize } from "sequelize";
import { config } from "dotenv";
import pg from "pg";

// Cargar las variables de entorno del archivo .env
config();

// Obtén la cadena de conexión desde las variables de entorno
const connectionString = process.env.SUPABASE_CONNECTION_STRING;

// Crea una instancia de Sequelize utilizando la cadena de conexión
export const sequelize = new Sequelize(connectionString, {
  define: {
    timestamps: false,
  },
  dialect: "postgres",
  dialectModule: pg,
});

// Verifica la conexión a la base de datos
sequelize
  .authenticate()
  .then(() => {
    console.log("Conexión con la base de datos establecida correctamente.");
  })
  .catch((err) => {
    console.error("Error al conectar con la base de datos:", err);
  });
