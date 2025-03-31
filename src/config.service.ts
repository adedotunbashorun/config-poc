import * as AWS from 'aws-sdk';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export class ConfigService {
  private readonly ssm: AWS.SSM;
  private config: Record<string, any> = {};
  private readonly basePath: string;

  constructor(basePath: string = '/eukapay/') {
    this.ssm = new AWS.SSM({ region: process.env.AWS_REGION || 'us-east-1' });
    this.basePath = basePath;
  }

  async loadConfig(env: string = 'dev'): Promise<void> {
    const fullPath = `${this.basePath}${env}/`;
    const parameters = await this.fetchSSMParameters(fullPath);
    this.config = { ...process.env, ...parameters };
  }

  private async fetchSSMParameters(path: string): Promise<Record<string, any>> {
    try {
      let parameters: Record<string, any> = {};
      let nextToken: string | undefined = undefined;

      do {
        const result = await this.ssm
          .getParametersByPath({ Path: path, WithDecryption: true, NextToken: nextToken })
          .promise();

        result.Parameters?.forEach((param) => {
          if (param.Name && param.Value) {
            const key = param.Name.replace(path, '').split('/').join('.');
            parameters[key] = param.Value;
          }
        });

        nextToken = result.NextToken;
      } while (nextToken);

      return parameters;
    } catch (error) {
      console.error(`Error fetching SSM parameters from ${path}:`, error);
      return {};
    }
  }

  get<T>(key: string): T {
    return key.split('.').reduce((acc, part) => acc && acc[part], this.config) as T;
  }

  getAll(): Record<string, any> {
    return this.config;
  }

  getServiceConfig(service: string): Record<string, any> {
    return this.get(service) || {};
  }
}