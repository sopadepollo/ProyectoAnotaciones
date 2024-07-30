const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const User = require('../models/User');
const Image = require('../models/Image');
const bcrypt = require('bcryptjs');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const cloudinary = require('../config/config');

//configuramos el almacenamiento en cloudinary para las imagenes
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'album', //carpeta donde se guardan las imagenes
    format: async (req, file) => 'jpg', //formato jpg por defecto
    public_id: (req, file) => file.originalname.split('.')[0], //el nombre del archivo sin extension
  },
});

const upload = multer({ storage: storage });

// middleware de autenticacion, si no estas logueado te manda al login
const auth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

//ruta principal, muestra las notas e imagenes del usuario
//se utiliza la peticion GET a la raiz ('/') del sitio web
// requiere que el usuario este autenticado, por eso el middleware 'auth' se pasa como segundo argumento
router.get('/', auth, async (req, res) => {
  try {
    //obtiene el usuario de la sesion actual
    const user = req.session.user;
    //se busca en todas las notas en la base de datos que pertenezcan al usuario
    const notes = await Note.find({ userId: user._id });
    //buscamos todas las imagenes en la base de datos que pertenezcan al usuario
    const images = await Image.find({ userId: user._id });
    // renderizamos la vista 'index' y le pasamos el usuario, notas e imagenes como datos
    res.render('index', { user, notes, images });
  } catch (err) {
    res.status(500).send(err.message);
  }
});


//ruta para el login
router.get('/login', (req, res) => {
  res.render('login');
});

//formulario de registro
router.get('/register', (req, res) => {
  res.render('register');
});

/*esto maneja la peticion POST a '/login'
se utiliza para autenticar a un usuario cuando intenta iniciar sesion*/
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    //busco un usuario en la base de datos que tenga el mismo nombre de usuario
    const user = await User.findOne({ username });
    if (!user) return res.status(400).send('invalid username or password.');
    //se comparala contrasena proporcionada con la contrasena almacenada en la base de datos usando bcrypt
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) return res.status(400).send('invalid username or password.');
    // si la autenticacion es exitosa, guardamos el usuario en la sesion
    req.session.user = user;
    // redirigimos al usuario a la pagina principal
    res.redirect('/');
  } catch (err) {
    res.status(500).send(err.message);
  }
});


//para el registro, guarda un nuevo usuario
//se utiliza para registrar un nuevo usuario en la aplicacion
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    // generamos una sal (salt) para la contrasena
    const salt = await bcrypt.genSalt(10);
    //hashamos la contrasena con la salt generada
    const hashedPassword = await bcrypt.hash(password, salt);
    //creamos un nuevo objeto de usuario con el nombre de usuario y la contrasena hasheada
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.redirect('/login');
  } catch (err) {
    res.status(500).send(err.message);
  }
});


//para subir imagenes, solo disponible para usuarios logueados
router.post('/upload', [auth, upload.single('image')], async (req, res) => {
  try {
    // creamos un nuevo objeto de imagen con la url de la imagen subida y el id del usuario logueado
    const newImage = new Image({
      url: req.file.path,
      userId: req.session.user._id,
    });
    // guardamos la nueva imagen en la base de datos
    await newImage.save();
    res.redirect('/');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//para crear una nota nueva
router.post('/notes', auth, async (req, res) => {
  try {
    //desestructuramos el titulo y contenido del cuerpo de la solicitud
    const { title, content } = req.body;
    if (!title || !content) {// verificamos si faltan campos necesarios
      return res.status(400).json({ message: 'faltan campos necesarios.' });
    }
    //creamos un nuevo objeto de nota con el titulo, contenido y el id del usuario logueado
    const newNote = new Note({
      title,
      content,
      userId: req.session.user._id,
    });

    // guardamos la nueva nota en la base de datos
    const savedNote = await newNote.save();
    
    res.status(201).json(savedNote);
  } catch (err) {
    console.error('error al guardar la nota:', err);
      res.status(500).json({ message: 'error al guardar la nota.' });
  }
});

//ruta para actualizar una nota existente
router.put('/notes/:id', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = await Note.findById(req.params.id);

    if (!note) return res.status(404).send('nota no encontrada.');
    if (note.userId.toString() !== req.session.user._id.toString()) {
      return res.status(403).send('no tienes permiso para modificar esta nota.');
    }

    note.title = title;
    note.content = content;
    const updatedNote = await note.save();

    res.status(200).json(updatedNote);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// para borrar una nota
router.delete('/notes/:id', auth, async (req, res) => {
  try {
    //buscamos la nota por su id en la base de datos
    const note = await Note.findById(req.params.id);
    //si la nota no existe, respondemos con un mensaje y el codigo de estado 404
    if (!note) return res.status(404).send('nota no encontrada.');

    if (note.userId.toString() !== req.session.user._id.toString()) {//verificamos si el usuario logueado es el dueño de la nota
      return res.status(403).send('no tienes permiso para eliminar esta nota.');
    }

    await Note.findByIdAndDelete(req.params.id);    // eliminamos la nota de la base de datos

    res.status(200).send('nota eliminada.');
  } catch (err) {
    console.error('error al eliminar la nota:', err.message);
    res.status(500).send('error al eliminar la nota.');
  }
});


// r
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;
