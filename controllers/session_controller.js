// MW para controlar la caducidad de la sesion
exports.autoLogout = function(req, res, next) {
  // Se comprueba del tiempo para el autologout
  if (req.session.user) {
    var ultimaSolicitud = (req.session.user.transactionTime) || 0;
    var fecha = new Date();

    // Se comprueba que no hayan pasado más de dos minutos
    if (Number(fecha.getTime()) - Number(ultimaSolicitud) > 120000 && Number(ultimaSolicitud) > 0) {
      // Se elimina la sessión y se continua
      delete req.session.user;
      next();
    } else {
      // Se guarda el tiempo de nuevo
      req.session.user.transactionTime = fecha.getTime();
      next();
    }
  } else
    next();
}

// Middleware de autorización de accesos HTTP restringidos
exports.loginRequired = function(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

// GET /login   -- Formulario de login
exports.new = function(req, res) {
  var errors = req.session.errors || {};
  req.session.errors = {};
  res.render('sessions/new', {
    errors: errors
  });
};

// POST /login  -- Crear la sesión
exports.create = function(req, res) {
  var login = req.body.login;
  var password = req.body.password;
  var userController = require('./user_controller');
  userController.autenticar(login, password, function(error, user) {
    if (error) { // Si hay error retornamos mensajes de error de sesión
      req.session.errors = [{
        "message": 'Se ha producido un error: ' + error
      }];
      res.redirect("/login");
      return;
    }

    // Crear req.session.user y guardar campos id y username
    // La sesión se define por la existencia de: req.session.user
    req.session.user = {
      id: user.id,
      username: user.username
    };
    res.redirect(req.session.redir.toString()); // Redirección al path anterior a login
  });
};

// DELETE /logout   -- Destruir la sesión
exports.destroy = function(req, res) {
  delete req.session.user;
  res.redirect(req.session.redir.toString()); // Redirección al path anterior a login
};
