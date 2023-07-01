/* eslint-disable */
import { pinoForLogger } from './../../infrastructure/logger';
import pinoHttp from 'pino-http';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';

export const middlewares = {
  loggerMiddleware: (req, res, next) =>
    pinoHttp({
      logger: pinoForLogger,
      genReqId(_req) {
        return new Date().getTime().toString();
      },
      serializers: {
        req(req) {
          req.body = req.raw.body;
          return req;
        },
      },
      autoLogging: true,
    })(req, res, next),
  urlencoded: bodyParser.urlencoded({ extended: true }),
  cors: cors({ origin: '*' }), // We allow any origin because we DO NOT USE cookies and basic auth
  helmet: helmet(),
};
