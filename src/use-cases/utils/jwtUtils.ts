import jwt from 'jsonwebtoken';
import { config } from '../../config';

const JWT_SECRET: string = config.session.jwtSecret;

const JWT_CONFIGURATION = config.session.jwtConfiguration;

export default {
  generateToken(payload: string | object) {
    return jwt.sign(payload, JWT_SECRET, JWT_CONFIGURATION);
  },
  checkToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
  },
};
