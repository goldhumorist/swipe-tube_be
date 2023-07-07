import jwt from 'jsonwebtoken';

const tokenSecret: string = require('config').get('session').secret;

export default {
  generateToken(payload: string | object) {
    return jwt.sign(payload, tokenSecret);
  },
  checkToken(token: string) {
    const tokenNoBearer = token?.split(' ')[1];
    return jwt.verify(tokenNoBearer, tokenSecret);
  },
};
