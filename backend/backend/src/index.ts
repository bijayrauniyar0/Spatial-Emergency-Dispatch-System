/* eslint-disable no-console */
// src/index.ts
import http from 'http';
import app from './server';
import { PORT } from './constants';
import sequelize from './config/database';
import { connectRedis } from './config/redis';

async function init() {
  const httpServer = http.createServer(app);

  sequelize
    .authenticate()
    .then(() => {
      return sequelize.sync({
        alter: true,
      });
    })
    .then(async () => {
      try {
        await connectRedis();
      } catch (err) {
        console.error('Socket error:', err);
      }
      httpServer.listen(Number(PORT) || 9000, '0.0.0.0', () => {});
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });
}

init();
