//esta funcion se encarga de verificar si el usuario esta autenticado antes de permitir el acceso a ciertas rutas
const auth = (req, res, next) => {
  if (req.session.user) {
    
    next();//si hayusuario en la sesion, pasa al siguiente middleware o ruta
  } else {
    //si no hay usuario en la sesion, redirige al usuario a la pagina de login
    res.redirect('/login');
  }
};
