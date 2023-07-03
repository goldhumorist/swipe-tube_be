import nodeConfig from 'config';

interface IConfig {
  nodeEnv: string;
  server: {
    port: number;
  };
  database: {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    dialect: string;
    schema: string;
  };
}

export const config: IConfig = {
  nodeEnv: nodeConfig.get('nodeEnv'),
  server: nodeConfig.get('server'),
  database: nodeConfig.get('database'),
};
