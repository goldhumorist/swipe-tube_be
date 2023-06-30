import nodeConfig from 'config';

interface IConfig {
  nodeEnv: string;
  server: {
    port: number;
  };
}

export const config: IConfig = {
  nodeEnv: nodeConfig.get('nodeEnv'),
  server: nodeConfig.get('server'),
};
