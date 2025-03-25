import { ConfigService } from "./config.service";

let configService: ConfigService;

export async function config() {
  const env = process.env.NODE_ENV || 'dev'; // Default to 'dev'
  if (!configService) {
    configService = new ConfigService('/eukapay/');
    await configService.loadConfig(env);
  }
  return configService;
}

export async function serviceConfig(service: string) {
  const cfg = await config();
  return cfg.getServiceConfig(service);
}