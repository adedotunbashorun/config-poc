import { ConfigService } from './config.service';

describe('ConfigService', () => {
  let configService: ConfigService;

  beforeEach(() => {
    configService = new ConfigService('/test/path/');
  });

  test('should initialize with default path', () => {
    expect(configService).toBeDefined();
  });

  test('should load environment variables', async () => {
    process.env.DB_HOST = 'localhost';
    await configService.loadConfig();
    expect(configService.get('DB_HOST')).toBe('localhost');
  });

  test('should return all configs', async () => {
    process.env.API_KEY = '12345';
    await configService.loadConfig();
    expect(configService.getAll()).toHaveProperty('API_KEY', '12345');
  });
});
