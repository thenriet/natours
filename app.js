const express = require('express');

const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDELEWARES

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
// This is a middleware, a function that can modifiy the incoming data
// It is needed to get access to the req.body from the POST request
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
// Custom middleware that will apply to every request
app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
// This is where I mount the routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
