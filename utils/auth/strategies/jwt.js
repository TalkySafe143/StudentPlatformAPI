const boom = require("@hapi/boom");
const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
const config = require("../../../config");

const userController = require("../../../controllers/usersController");

passport.use(
  new Strategy(
    {
      secretOrKey: config.JWT_SECRET,
       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    },
    async (payload, cb) => {
      try {
        const user = await userController.getOneUser( // Simular llamada a la API
          { params: { id: payload.cc }, jwtProcess: true }, 
          {}, 
          () => {}
        );

        if (!user) return cb(boom.unauthorized('No tiene JWT'), null);

        delete user.password;

        return cb(null, user);
      } catch (e) {
        return cb(e, null);
      }
    }
  )
)