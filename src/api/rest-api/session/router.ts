import { FastifyPluginCallback } from 'fastify';
import controllers from './controllers';

const sessionRouter: FastifyPluginCallback = (app, opts, done) => {
  app.get('/check', controllers.session.checkSession);

  done();
};

export default sessionRouter;
