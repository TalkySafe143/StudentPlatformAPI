const boom = require("@hapi/boom");
const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
const config = require("../../../config");

const userController = require("../../../components/users/usersController");

passport.use(
  new Strategy(
    {
      secretOrKey: config.JWT_SECRET,
       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    },
    async (payload, cb) => {
      try {
        const user = await userController.getOneUser( // Simular llamada a la API
          { params: { id: payload.sub.cc }, jwtProcess: true },
          {}, 
          () => {}
        );

        if (!user[0]) return cb(boom.unauthorized('La cuenta no se encontró'), null);

        delete user[0].password;

        return cb(null, user);
      } catch (e) {
        return cb(e, null);
      }
    }
  )
)