import { ConfigService } from './config.service';

let configService: ConfigService;

export async function config(path: string = '/app/config/') {
  if (!configService) {
    configService = new ConfigService(path);
    await configService.loadConfig();
  }
  return configService;
}

// Example usage in another service
// import { config } from 'config-lib';
// async function main() {
//   const cfg = await config('/app/prod/config/');
//   console.log(cfg.get('db.url'));
// }