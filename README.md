# Manual de Instalación - PlayUML

Este es un manual paso a paso para instalar y configurar PlayUML.

## Requisitos Previos

Asegúrate de tener instalados los siguientes programas antes de comenzar la instalación:

- **Node.js y npm:** [https://nodejs.org/en/download] Se recomienda utilizar Node.js versión 18.20.2 (LTS).
- **PostgreSQL y pgAdmin:** [https://www.postgresql.org/download] Se recomienda utilizar PostgreSQL versión 16.2.1. Sigue las instrucciones de instalación para tu sistema operativo. Durante el proceso de instalación de PostgreSQL, se te dará la opción de instalar pgAdmin, pero si deseas obtenerlo por separado, puedes descargarlo desde [https://www.pgadmin.org/download].

## Pasos de Instalación

1. **Clonar el Repositorio**

   Clona el repositorio de GitHub de la aplicación utilizando el siguiente comando:

   ```
   git clone https://github.com/FerLRT/playUML
   ```

2. **Instalar Dependencias**

   Desde una terminal, navega hasta la carpeta del proyecto y ejecuta el siguiente comando para instalar todas las dependencias necesarias tanto para el cliente como para el servidor:

   ```
   cd <carpeta_del_proyecto>
   npm run install-deps
   ```

   Esto instalará automáticamente las dependencias del cliente y del servidor en sus respectivas carpetas.

3. **Configurar la Base de Datos**

   Para configurar la base de datos en PostgreSQL utilizando pgAdmin, sigue estos pasos:

   - Abre pgAdmin, la interfaz gráfica de administración de PostgreSQL.
   - En la sección "Servers" en la parte superior izquierda de la ventana, despliega la opción correspondiente a tu servidor PostgreSQL. Normalmente aparecerá como "PostgreSQL 16".
   - Dentro de la lista de bases de datos, haz clic derecho y selecciona "Create" → "Database...".
   - En el cuadro de diálogo que aparece, ingresa el nombre de la nueva base de datos. Por ejemplo, puedes nombrarla "playuml". Luego, haz clic en "Save" para crear la base de datos.
   - Una vez creada la base de datos, haz clic derecho sobre ella en la lista de bases de datos y selecciona "Create Script".
   - En el panel de scripts que se abre, arrastra y suelta el archivo `database.sql` desde la carpeta `database` de tu proyecto hacia el panel.
   - Una vez que hayas agregado el script SQL, ejecútalo haciendo clic en el botón correspondiente para ejecutar el script completo.

   Estos pasos te permitirán configurar la base de datos `playuml` en tu servidor PostgreSQL y ejecutar el script SQL proporcionado para inicializar la base de datos con la estructura y datos necesarios para tu proyecto.

4. **Configurar variables de entorno**

   Para configurar las variables de entorno en tu proyecto, sigue estos pasos:

   - En la carpeta `client`, copia y pega el archivo `.env.example` en el mismo directorio. Luego, renombra el archivo copiado a `.env`. Este archivo contendrá las variables de entorno necesarias para la configuración del cliente.
   - Si no hay problemas de puertos, no necesitarás hacer ningún cambio en el archivo `.env` del cliente.
   - En la carpeta `server`, repite el mismo proceso: copia y pega el archivo `.env.example` en el mismo directorio y renómbralo a `.env`. Este archivo contendrá las variables de entorno necesarias para la configuración del servidor. En este archivo debes completar las variables de entorno según se indica en el propio archivo.
   - Para la variable `database_connection_string`, necesitarás obtener la información de conexión. Para ello, sigue estos pasos:
     - En pgAdmin, dentro de la sección "Servers" en la parte superior izquierda de la ventana selecciona el apartado "PostgreSQL 16" y selecciona la opción "Properties" para ver las propiedades de la conexión.
     - En este punto necesitarás la información de `Username`, `Puerto` y `Host` para construir la cadena de conexión. La variable debe tener el siguiente formato: postgresql://usuario:contraseña@host:puerto/nombre_basedatos.

   Siguiendo estos pasos, configurarás correctamente las variables de entorno tanto para el cliente como para el servidor en tu proyecto.

5. **Iniciar aplicación**

   Para iniciar la aplicación, sigue estos pasos:

   - Desde la raíz del proyecto, ejecuta el siguiente comando para iniciar el cliente:

   ```
   npm run start:client
   ```

   - Abre otra terminal y desde la raíz del proyecto, ejecuta el siguiente comando para iniciar el servidor:

   ```
   npm run start:server
   ```

   Siguiendo estos pasos, podrás iniciar tanto el cliente como el servidor.

6. **Acceder a la Aplicación**

   Una vez que el servidor y el cliente estén iniciados correctamente, abre tu navegador web y navega a `http://localhost:3001` para acceder a la aplicación.
