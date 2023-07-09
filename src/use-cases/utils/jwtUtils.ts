import jwt from 'jsonwebtoken';
import { config } from '../../config';

const JWT_SECRET = config.session.jwtSecret;

const JWT_CONFIGURATION = {
  expiresIn: config.session.jwtExpiresIn,
};

export default {
  generateToken(payload: string | object) {
    return jwt.sign(payload, JWT_SECRET, JWT_CONFIGURATION);
  },
  checkToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
  },
};
