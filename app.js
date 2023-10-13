const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet')
const cors = require('cors')
// Swagger
const swaggerUI = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerSpecs = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Javeplatform API",
      version: "1.0.0"
    },
    servers: [
      {
        url: "http://localhost:3000"
      }
    ]
  },
  apis: [`${path.join(__dirname, './routes/*.js')}`]
}

const usersRouter = require('./components/users/usersRoutes');
const materialRouter = require('./components/material/materialRoutes');
const materiasRouter = require('./components/materias/materiasRoutes');
const authRouter = require("./components/auth/authRoutes");

const app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/users', usersRouter);
app.use('/api/material', materialRouter);
app.use('/api/materias', materiasRouter)
app.use('/api/auth', authRouter);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJSDoc(swaggerSpecs)))


// catch 404 and forward to error handler
app.use( (req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render('error');
  res.json({err: err.message})
});

module.exports = app;
