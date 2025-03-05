import { ConfigService } from './config.service';

let configService: ConfigService;

export async function config(path: string = '/app/config/') {
  if (!configService) {
    configService = new ConfigService(path);
    await configService.loadConfig();
  }
  return configService;
}

export async function serviceConfig(service: string) {
  const cfg = await config();
  return cfg.getServiceConfig(service);
}
