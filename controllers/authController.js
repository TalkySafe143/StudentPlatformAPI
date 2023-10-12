const passport = require("passport")
const jwt = require("jsonwebtoken");
const encryptionWorker = require("../utils/encryptionWorker");
const usersController = require("usersController");

async function login(req, res, next) {
  passport.authenticate('basic', {}, (err, user) => {
    try {
      if (err || !user) return next(boom.unauthorized(err));

      req.login(user, { session: false }, async (err) => {

        if (err) return next(err);

        const payload = {
          sub: user
        };

        const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: '30m' });

        return res.status(200).json({
          token
        });
        
      })
      
    } catch (e) {
      next(e)
    }
  })(req, res, next);
}

async function register(req, res, next) {
  const user = req.body;

  if (encryptionWorker.checkSQLEntry(user)) {
    return res.status(404).json({
      err: "Ups, sucedio algo con tus datos"
    });
  }

  try  {
    const userExist = await usersController.getOneUser(
      { params: { id: user.cc }, jwtProcess: true },
      {},
      () => {}
    );

    if (userExist) return next(boom.badRequest("Este usuario ya esta creado"));

    const userCreated = await usersController.createUser(
      { body: user, jwtProcess: true },
      {},
      () => {}
    );

    return res.status(200).json({
      message: "Usuario creado correctamente",
      userCreated
    });
    
  } catch (e) {
    next(e)
  }
  
}

module.exports = { login, register }