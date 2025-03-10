import * as AWS from 'aws-sdk';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export class ConfigService {
  private readonly ssm: AWS.SSM;
  private config: Record<string, any> = {};
  private readonly path: string;

  constructor(path: string = '/app/config/') {
    this.ssm = new AWS.SSM({ region: process.env.AWS_REGION || 'us-east-1' });
    this.path = path;
  }

  async loadConfig(): Promise<void> {
    const parameters = await this.fetchSSMParameters();
    this.config = { ...process.env, ...parameters };
  }

  private async fetchSSMParameters(): Promise<Record<string, string>> {
    try {
      let parameters: Record<string, string> = {};
      let nextToken: string | undefined = undefined;

      do {
        const result = await this.ssm
          .getParametersByPath({ Path: this.path, WithDecryption: true, NextToken: nextToken })
          .promise();

        result.Parameters?.forEach((param) => {
          if (param.Name && param.Value) {
            parameters[param.Name.replace(this.path, '')] = param.Value;
          }
        });

        nextToken = result.NextToken;
      } while (nextToken);

      return parameters;
    } catch (error) {
      console.error('Error fetching SSM parameters:', error);
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
    return this.config[service] || {};
  }
}
