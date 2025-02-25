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
      const result = await this.ssm
        .getParametersByPath({ Path: this.path, WithDecryption: true })
        .promise();
      
      const parameters: Record<string, string> = {};
      result.Parameters?.forEach((param: AWS.SSM.Parameter) => {
        if (param.Name && param.Value) {
          parameters[param.Name.replace(this.path, '')] = param.Value;
        }
      });
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
}