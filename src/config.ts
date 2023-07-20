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
    seederStorage: string;
  };
  S3: {
    accessKeyId: string;
    secretAccessKey: string;
    bucket: string;
    bucketRegion: string;
  };
  session: {
    jwtSecret: string;
    jwtExpiresIn: string;
  };
}

export const config: IConfig = {
  nodeEnv: nodeConfig.get('nodeEnv'),
  server: nodeConfig.get('server'),
  database: nodeConfig.get('database'),
  S3: nodeConfig.get('S3'),
  session: nodeConfig.get('session'),
};
