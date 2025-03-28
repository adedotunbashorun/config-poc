# Config Library

A configuration management library for handling environment variables using AWS SSM and dotenv. This library provides a structured way to manage shared configurations across multiple services while also allowing service-specific configurations.

## Installation

Install via npm:

```sh
npm install git+https://github.com/adedotunbashorun/config-poc.git
```

Or for local development:

```sh
npm install git+https://github.com/adedotunbashorun/config-poc.git
```

## Usage in JavaScript/TypeScript Projects

### Basic Usage

```typescript
import { config } from '@eukapay/config';

(async () => {
  const cfg = await config('/app/prod/config/');
  console.log(cfg.get('db.url'));
})();
```

### Service-Specific Configuration

```typescript
import { serviceConfig } from '@eukapay/config';

(async () => {
  const serviceAConfig = await serviceConfig('serviceA');
  console.log(serviceAConfig.app.url); // Retrieves service-specific URL
})();
```

## Usage in NestJS

### Step 1: Create a `ConfigModule`

Create a **global configuration module** in NestJS.

#### `src/config/config.module.ts`

```typescript
import { Module, Global } from '@nestjs/common';
import { config } from '@eukapay/config';

@Global()
@Module({
  providers: [
    {
      provide: 'CONFIG',
      useFactory: async () => await config('/app/prod/config/'),
    },
  ],
  exports: ['CONFIG'],
})
export class ConfigModule {}
```



### Step 2: Register in `AppModule`

Modify `src/app.module.ts` to load `ConfigModule`.

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [ConfigModule],
})
export class AppModule {}
```

### Step 3: Inject Config into Services

Now, you can inject the `CONFIG` service anywhere in your NestJS app.

#### `src/app.service.ts`

```typescript
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(@Inject('CONFIG') private readonly config: any) {}

  getDatabaseUrl(): string {
    return this.config.get('db.url');
  }
}
```

## Usage in Express.js

### Step 1: Load Config in `server.ts`

```typescript
import express from 'express';
import { config } from '@eukapay/config';

const app = express();

(async () => {
  const cfg = await config('/app/prod/config/');
  app.locals.config = cfg.getAll();
})();

app.get('/db-url', (req, res) => {
  res.json({ dbUrl: req.app.locals.config.db?.url });
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

### Step 2: Access Config in Routes

```typescript
import { Router } from 'express';
const router = Router();

router.get('/app-url', (req, res) => {
  const config = req.app.locals.config;
  res.json({ appUrl: config.app?.url });
});

export default router;
```

## Testing the Configuration Library

To ensure your library is working correctly, add Jest tests.

### Install Testing Dependencies

```sh
npm install --save-dev jest ts-jest @testing-library/jest-dom
```

### Example Test

#### `tests/configService.spec.ts`

```typescript
import { ConfigService } from '../src/config/config.service';

describe('ConfigService', () => {
  let configService: ConfigService;

  beforeEach(async () => {
    configService = new ConfigService('/app/test/config/');
    await configService.loadConfig();
  });

  test('should retrieve environment variables', () => {
    process.env.DB_HOST = 'localhost';
    expect(configService.get('DB_HOST')).toBe('localhost');
  });
});
```

### Run Tests

```sh
npm test
```