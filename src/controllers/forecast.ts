import { Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';

@Controller('forecast')
export class ForecastController {
  @Get('')
  public getForecastForLoggedUser(req: Request, res: Response): void {
    res.status(200).send({
      time: '2023-02-06T00:00:00+00:00',
      forecast: [
        {
          lat: -33.79,
          lng: 151.29,
          name: 'Manly',
          position: 'E',
          rating: 2,
          swellDirection: 64.26,
          swellHight: 0.15,
          swellPeriod: 3.89,
          time: '2023-02-06T00:00:00+00:00',
          waveDirection: 231.38,
          waveHeight: 0.47,
          windDirection: 299.45,
        },
      ],
    });
  }
}
