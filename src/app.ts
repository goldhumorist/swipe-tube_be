import * as RestAPI from './api/rest-api/www';
import { config } from './config';
import { Database } from './domain-model';
import { loggerFactory } from './infrastructure/logger';

const logger = loggerFactory.getLogger(__filename);

async function main() {
  logger.info(`[App] Init Mode: ${config.nodeEnv}`);

  RestAPI.start({ appPort: config.server.port });

  Database.initModels();

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

    await Database.getInstance().close();

    logger.info('[App] Exit');
    process.exit(0);
  }
}

main().catch(err => {
  console.error(err);

  process.exit(1);
});
