import express from 'express';
import { loggerFactory } from '../../infrastructure/logger';
import { promisify } from 'util';
import { middlewares } from './middlewares';
import userRouter from './user/router';

const logger = loggerFactory.getLogger(__filename);

const app = express();

app.use(middlewares.json);
app.use(middlewares.urlencoded);
app.use(middlewares.cors);
app.use(middlewares.helmet);
app.use(middlewares.loggerMiddleware);

app.use('/api/v1/user', userRouter);

let server;

export function start({ appPort }) {
  const normalizedPort = normalizePort(appPort);

  server = app.listen(normalizedPort, () => {
    const { port, address } = server.address();

    logger.info(`[RestApiApp] STARTING AT PORT [${port}] ADDRESS [${address}]`);
  });

  server.closeAsync = promisify(server.close);
}

export async function stop() {
  if (!server) return;
  logger.info('[RestApiApp] Closing server');
  await server.closeAsync();
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
