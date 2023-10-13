const passport = require("passport");
const { BasicStrategy } = require("passport-http");
const boom = require("@hapi/boom");
const encryptionWorker = require("../../encryptionWorker");
const userController = require("../../../components/users/usersController");

passport.use(
  new BasicStrategy(
    async (cc, password, cb) => {
      try {
        const user = await userController.getOneUser(
          { params: { id: cc }, jwtProcess: true },
          {},
          () => {}
        );

        if (!user[0]) return cb(boom.unauthorized('Alguna informacion esta incorrecta'), null);

        if (!(await encryptionWorker.checkPassword(user[0].password, password))) return cb(boom.unauthorized('Alguna informacion esta incorrecta'), null);

        delete user.password;

        return cb(null, user);
      } catch (e) {
        return cb(e, null);
      }
    }
  )
)