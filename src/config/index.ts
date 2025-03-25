import { config } from "./config";

export default async () => {
  const cfg = await config();
  return {
    app: {
      logLevel: cfg.get('app.logLevel'),
      supportEmail: cfg.get('app.supportEmail'),
    },
    smtp: {
      user: cfg.get('smtp-username'),
      password: cfg.get('smtp-password'),
      fromEmail: cfg.get('smtp-from-email'),
      port: cfg.get('smtp-from-port'),
      host: cfg.get('smtp-host'),
    },
    auth: {
      secret: cfg.get('nextauth-secret'),
      url: cfg.get('nextauth-url'),
      urlInternal: cfg.get('nextauth-url-internal'),
    },
    database: {
      webhookId: cfg.get('nexus-webhook-id'),
      refresh: cfg.get('nexus-refresh'),
      username: cfg.get('nexus-username'),
      password: cfg.get('nexus-password'),
      twoFactor: cfg.get('nexus-2fa'),
    },
    integrations: {
      aquanow: {
        accessKey: cfg.get('aquanow-access-key'),
        secretKey: cfg.get('aquanow-secret-key'),
        apiUrl: cfg.get('aquanow-api-url'),
      },
      plaid: {
        clientId: cfg.get('plaid-client-id'),
        secret: cfg.get('plaid-secret'),
        env: cfg.get('plaid-env'),
      },
      apaylo: {
        id: cfg.get('apaylo-id'),
        key: cfg.get('apaylo-key'),
        secret: cfg.get('apaylo-secret'),
        apiUrl: cfg.get('apaylo-api-url'),
      },
    },
    google: {
      clientId: cfg.get('google-client-id'),
      clientSecret: cfg.get('google-client-secret'),
    },
    linkedin: {
      clientId: cfg.get('linkedin-client-id'),
      clientSecret: cfg.get('linkedin-client-secret'),
    },
    security: {
      appSecret: cfg.get('app-secret-key'),
      encryptionKey: cfg.get('api-encryption-key'),
      encryptionAlgorithm: cfg.get('api-encryption-algorithm'),
    },
    blockchain: {
      trongridApiKey: cfg.get('trongrid-api-key'),
      etherscanApiKey: cfg.get('etherscan-api-key'),
      nownodesKey: cfg.get('nownodes-key'),
    },
  };
};
