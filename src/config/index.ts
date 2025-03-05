import { config } from "./config";

export default async () => {
  const cfg = await config('/app/prod/config/');
  return {
    app: {
      logLevel: cfg.get('app.logLevel'),
      supportEmail: cfg.get('app.supportEmail'),
    },
  };
};
