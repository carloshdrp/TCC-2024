const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const path = require('path');
const app = require('express')();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:4173'],
    credentials: true,
  },
});
const routes = require('./routes');
const { jwtStrategy } = require('./config/passport');
const { errorConverter, errorHandler } = require('./middlewares/error');
const { ApiError } = require('./utils');
const { addUserSocket, removeUserSocket, rejectAuthPromise } = require('./socketManager');

io.on('connection', (socket) => {
  socket.on('authenticate', (userId) => {
    try {
      addUserSocket(userId, socket);
      socket.userId = userId;
      socket.emit('authenticated', userId);
    } catch (error) {
      rejectAuthPromise(socket.userId, new Error('Sessão expirada'));
      socket.emit('authentication_error', 'Sessão expirada');
      socket.disconnect(true);
    }
  });

  socket.on('disconnect', () => {
    if (socket.userId) {
      removeUserSocket(socket.userId);
    }
  });
});

const whitelist = ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:4173'];
const corsOptions = {
  origin(origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use('/uploads', express.static(path.join(__dirname, 'files')));

app.use(helmet());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

app.use(cors(corsOptions));

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      message: 'Limite de requisições atingido. Tente novamente mais tarde.',
      code: httpStatus.TOO_MANY_REQUESTS,
    });
  },
});
app.use(generalLimiter);

app.use('/', routes);

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, `Route "${req.originalUrl}" not found`));
});

app.use(errorConverter);

app.use(errorHandler);

module.exports = { httpServer };
