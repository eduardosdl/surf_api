import { ClassMiddleware, Controller, Post } from '@overnightjs/core';
import { Request, Response } from 'express';

import { Beach } from '@src/models/beach';
import { authMiddleware } from '@src/middlewares/auth';
import { BaseController } from './index';

@Controller('beaches')
@ClassMiddleware(authMiddleware)
export class BeachesController extends BaseController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const beach = new Beach({ ...req.body, ...{ user: req.decoded?.id } });
      const result = await beach.save();

      res.status(201).send(result);
    } catch (err) {
      this.sendCreateUpdateErrorResponse(res, err);
    }
  }
}
