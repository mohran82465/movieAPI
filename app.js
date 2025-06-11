const express = require('express');

const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet'); 
const sanitize = require('express-mongo-sanitize');
const xss = require('xss-clean')

const moviesRouter = require("./Routes/moviesRoutes");
const authRouter = require("./Routes/authRouter");
const usersRouter = require("./Routes/userRouter");
const CustomError = require('./Utils/CustomError');
const globalErrorHandler = require('./Controllers/errorController');
// const logger = function (req, res, next) {
//     console.log('Custom middleware called');
//     next();
// }
let app = express();
let limiter = rateLimit({
  max: 3,
  windowMs: 60 * 60 * 1000,
  message: 'We have received too many requrest from this Ip. Please try after one hour',
});

app.use('/api', limiter)
app.use(helmet())

app.use(express.json({limit:'11kb'}));

app.use(sanitize()); 
app.use(xss());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// app.use(logger);
app.use((req, res, next) => {
  req.requestedAt = new Date().toISOString();
  next();
})




app.use('/api/v1/movies', moviesRouter);
app.use('/api/v1/user', usersRouter);
app.use('/api/v1/auth', authRouter);


app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on the server`
  // });
  // const err = new Error(`Can't find ${req.originalUrl} on the server`);
  // err.statusCode = 404 ; 
  // err.status = 'fail';  
  const err = new CustomError(`Can't find ${req.originalUrl} on the server`, 404);

  next(err);
});


app.use(
  globalErrorHandler
)

module.exports = app; 
