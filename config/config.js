//aqui estamos configurando cloudinary, una herramienta para manejar imagenes en la nube
const cloudinary = require('cloudinary').v2; //llevamos la libreria de cloudinary
const dotenv = require('dotenv');//traemos dotenv para manejar las variables de entorno

dotenv.config(); //carga de las variables de entorno desde el archivo .env

//configuracion de cloudinary con las credenciales que estah el archivo .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary; // Exportamos la configuracion para que pueda ser usada en otros archiv
