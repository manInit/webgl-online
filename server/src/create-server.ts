import fs from 'fs';
import http from 'http';
import https from 'https';
import { Express } from 'express';

export function createServer(app: Express): https.Server | http.Server {
  if (process.env.IS_HTTPS !== '1') {
    return http.createServer(app);
  }

  if (!process.env.CERT_PATH || !process.env.KEY_CERT_PATH) {
    throw new Error('Cert for https not set');
  }

  const options = {
    key: fs.readFileSync(process.env.KEY_CERT_PATH),
    cert: fs.readFileSync(process.env.CERT_PATH),
  };
  return https.createServer(options, app);
}
