import path from 'path';
import { Sequelize } from 'sequelize-typescript';
import { config } from '../config';
import { loggerFactory } from '../infrastructure/logger';
import { Dialect } from 'sequelize';

const logger = loggerFactory.getLogger(__filename);

const {
  database,
  password,
  dialect,
  username,
  schema,
  port,
  host,
  seederStorage,
} = config.database;

export class Database {
  private static dbInstance: Sequelize;

  static getInstance() {
    return Database.dbInstance;
  }

  static initModels() {
    if (Database.dbInstance) return;

    Database.dbInstance = new Sequelize({
      database,
      dialect: dialect as Dialect,
      username,
      password,
      port,
      host,
      schema,
      storage: ':memory:',
      logging: (m: string) => logger.info(m),
      models: [path.join(__dirname, '*.model.*')],
      modelMatch: (filename, member) => {
        return (
          filename
            .substring(0, filename.indexOf('.model'))
            .split('-')
            .join('')
            .toLowerCase() === member.toLowerCase()
        );
      },
      dialectOptions: {
        keepAlive: true,
        keepAliveInitialDelayMillis: 120000,
        connectTimeout: 30000,
        query_timeout: 30000,
        statement_timeout: 20000,
        idle_in_transaction_session_timeout: 30000,
      },
      pool: {
        min: 0,
        max: 10,
        idle: 10000, // The maximum time, in milliseconds, that a connection can be idle before being released.
        acquire: 30000, // ..., that pool will try to get connection before throwing error
      },
      retry: {
        // Set of flags that control when a query is automatically retried.
        match: [
          /SequelizeConnectionError/,
          /SequelizeConnectionRefusedError/,
          /SequelizeHostNotFoundError/,
          /SequelizeHostNotReachableError/,
          /SequelizeInvalidConnectionError/,
          /SequelizeConnectionTimedOutError/,
          /TimeoutError/,
          /SequelizeDatabaseError/,
        ],
        max: 5, // How many times a failing query is automatically retried.
      },
    });
  }
}
