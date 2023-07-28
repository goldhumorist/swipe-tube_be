import { FastifyPluginCallback } from 'fastify';
import controllers from './controllers';

const userRouter: FastifyPluginCallback = (app, opts, done) => {
  app.post('/signup', controllers.users.signup);
  app.post('/login', controllers.users.login);

  done();
};

export default userRouter;
