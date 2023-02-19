import { Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';

@Controller('forecast')
export class ForecastController {
  @Get('')
  public getForecastForLoggedUser(req: Request, res: Response): void {
    res.status(200).send([
      {
        time: '2023-02-12T00:00:00+00:00',
        forecast: [
          {
            lat: -8.2601,
            lng: -34.9451,
            name: 'Paiva',
            position: 'E',
            rating: 1,
            swellDirection: 45.54,
            swellHeight: 0.37,
            swellPeriod: 8.94,
            time: '2023-02-12T00:00:00+00:00',
            waveDirection: 151.94,
            waveHeight: 1.16,
            windDirection: 161.9,
            windSpeed: 1.58,
          },
        ],
      },
      {
        time: '2023-02-12T01:00:00+00:00',
        forecast: [
          {
            lat: -8.2601,
            lng: -34.9451,
            name: 'Paiva',
            position: 'E',
            rating: 1,
            swellDirection: 67.59,
            swellHeight: 0.38,
            swellPeriod: 9.77,
            time: '2023-02-12T01:00:00+00:00',
            waveDirection: 151.21,
            waveHeight: 1.15,
            windDirection: 163.25,
            windSpeed: 1.61,
          },
        ],
      },
    ]);
  }
}
