import { Controller, Post } from '@overnightjs/core';
import { Request, Response } from 'express';

import { User } from '@src/models/user';
import AuthService from '@src/services/auth';
import { BaseController } from './index';

@Controller('users')
export class UserController extends BaseController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const user = new User(req.body);
      const newUser = await user.save();

      res.status(201).send(newUser);
    } catch (err) {
      this.sendCreateUpdateErrorResponse(res, err);
    }
  }

  @Post('authenticate')
  public async authenticate(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return this.sendErrorRespose(res, {
        code: 401,
        message: 'User not found',
      });
    }

    const passwordIsValid = await AuthService.comparePasswords(
      password,
      user.password
    );

    if (!passwordIsValid) {
      return this.sendErrorRespose(res, {
        code: 401,
        message: 'Password does not match',
      });
    }

    const token = AuthService.generateToken(user.toJSON());

    return res.status(200).send({ token });
  }
}
