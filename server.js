const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

//cargar las variables de entorno desde el archivo .env
dotenv.config();

const app = express();

//middleware para parsear el cuerpo de las solicitudes como json
app.use(express.json());

//middleware por parsear datos urlencoded
app.use(express.urlencoded({ extended: false }));

//conectar a la bd usando las variables de entorno
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('mongodb connected'))
  .catch(err => console.error('mongodb connection error:', err));

//    configurar y usar las sesiones en la aplicacion
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

//servir archivos estaticos desde la carpeta 'public' para acceder a ellos 
app.use('/public', express.static('public'));

//configurar el motor de vistas para usar los ejs
app.set('view engine', 'ejs');
app.set('views', './views');

// importar y usar las rutas definidas en el archivo routes.js
const routes = require('./routes/routes');
app.use('/', routes);

// definir el puerto en el que el servidor escuchara las solicitudes
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
