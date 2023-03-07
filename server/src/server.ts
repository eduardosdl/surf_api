import './utils/module_alias';
import { Server } from '@overnightjs/core';
import express, { Application } from 'express';
import expressPino from 'express-pino-logger';
import cors from 'cors';

import { ForecastController } from './controllers/forecast';
import { BeachesController } from './controllers/beaches';
import { UserController } from './controllers/users';
import * as database from '@src/databse';
import logger from './logger';

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  private setupExpress(): void {
    this.app.use(express.json());
    this.app.use(
      expressPino({
        logger,
      })
    );
    this.app.use(
      cors({
        origin: '*',
      })
    );
  }

  private setupController(): void {
    const forecastController = new ForecastController();
    const beachesController = new BeachesController();
    const userController = new UserController();

    this.addControllers([
      forecastController,
      beachesController,
      userController,
    ]);
  }

  private async databseSetup(): Promise<void> {
    await database.connect();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupController();
    await this.databseSetup();
  }

  public start(): void {
    this.app.listen(this.port, () => {
      logger.info(`Server listening of port: ${this.port}`);
    });
  }

  public async close(): Promise<void> {
    await database.close();
  }

  public getApp(): Application {
    return this.app;
  }
}
