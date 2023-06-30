import * as RestAPI from './api/rest-api/www';
import { config } from './config';
import { loggerFactory } from './lib/infrastructure/logger';

const logger = loggerFactory.getLogger(__filename);

async function main() {
  logger.info(`[App] Init Mode: ${config.nodeEnv}`);

  RestAPI.start({ appPort: config.server.port });

  process.on('SIGTERM', async () => {
    logger.info('[App] SIGTERM signal catched');

    await shutdown();
  });

  process.on('SIGINT', async () => {
    logger.info('[App] SIGINT signal catched');

    await shutdown();
  });

  process.on('unhandledRejection', error => {
    console.error(error);

    logger.error('UnhandledRejection', error);
  });

  process.on('uncaughtException', error => {
    console.error(error);

    logger.error('UncaughtException', error);
  });

  // Graceful shutdown
  async function shutdown() {
    await RestAPI.stop();

    logger.info('[App] Exit');
    process.exit(0);
  }
}

main().catch(err => {
  console.error(err);

  process.exit(1);
});
