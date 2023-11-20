const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { jwt } = require('./index');
const { tokenTypes } = require('./token');
const { prisma } = require('./database');

const jwtOptions = {
  secretOrKey: jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error('Tipo de token inválido!');
    }

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });

    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};
