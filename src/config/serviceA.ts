import { config } from './config';

export default async () => {
  const cfg = await config();
  return {
    app: {
      url: cfg.get('app.url'),
      port: cfg.get('app.port'),
    },
    database: {
      host: cfg.get('db.host'),
      user: cfg.get('db.user'),
      password: cfg.get('db.password'),
    },
  };
};
