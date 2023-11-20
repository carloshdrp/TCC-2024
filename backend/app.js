const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const passport = require('passport');
const routes = require('./routes');
const { jwtStrategy } = require('./config/passport');

const app = express();

app.use(helmet());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/', routes);

app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

const whitelist = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:8080'];
const corsOptions = {
  origin(origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
app.use(cors(corsOptions));

module.exports = app;
