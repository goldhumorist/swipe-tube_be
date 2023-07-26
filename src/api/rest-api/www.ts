import Fastify from 'fastify';
import { loggerFactory } from '../../infrastructure/logger';
import { plugins, pluginsOptions, fastifyOptions, handlers } from '../utils';
import userRouter from './user/router';
import videoRouter from './video/router';
import sessionRouter from './session/router';

const logger = loggerFactory.getLogger(__filename);

const app = Fastify(fastifyOptions);

app.register(plugins.formBody);
app.register(plugins.cors, pluginsOptions.cors);
app.register(plugins.helmet);
app.register(plugins.fileContentParser);

app.addHook('preHandler', handlers.preHandlerBodyLogger);

app.register(userRouter, { prefix: '/api/v1/user' });
app.register(sessionRouter, { prefix: '/api/v1/session' });
app.register(videoRouter, { prefix: '/api/v1/video' });

const server = app;

export async function start({ appPort }) {
  const port = normalizePort(appPort);

  app.listen({ port }, (error, address) => {
    if (error) throw error;

    logger.info(`[RestApiApp] STARTING ON ADDRESS [${address}]`);
  });
}

export async function stop() {
  if (!server) return;
  logger.info('[RestApiApp] Closing server');
  await server.close();
}
/**
 * Helper
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (Number.isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

export default app;
