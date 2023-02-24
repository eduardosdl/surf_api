import { ForecastPoint, StormGlass } from '@src/clients/stormGlass';
import { internalError } from '@src/utils/errors/internal_error';
import { BeachProps } from '@src/models/beach';

export interface TimeForecast {
  time: string;
  forecast: BeachForecast[];
}

export interface BeachForecast
  extends Omit<BeachProps, 'user'>,
    ForecastPoint {}

export class ForecastProcessingInternalError extends internalError {
  constructor(message: string) {
    super(`Unexpected error during the forecast processing: ${message}`);
  }
}

export class Forecast {
  constructor(protected stormGlass = new StormGlass()) {}

  public async processForecastForBeaches(
    beaches: BeachProps[]
  ): Promise<TimeForecast[]> {
    const pointsWithCorrectSources: BeachForecast[] = [];

    try {
      for (const beach of beaches) {
        const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
        const enrichedBeachData = this.enrichedBeachData(points, beach);

        pointsWithCorrectSources.push(...enrichedBeachData);
      }
    } catch (err) {
      throw new ForecastProcessingInternalError((err as Error).message);
    }

    return this.mapForecastByTime(pointsWithCorrectSources);
  }

  private enrichedBeachData(
    points: ForecastPoint[],
    beach: BeachProps
  ): BeachForecast[] {
    return points.map((value) => ({
      ...{
        lat: beach.lat,
        lng: beach.lng,
        name: beach.name,
        position: beach.position,
        rating: 1,
      },
      ...value,
    }));
  }

  private mapForecastByTime(forecast: BeachForecast[]): TimeForecast[] {
    const forecastByTime: TimeForecast[] = [];

    for (const point of forecast) {
      const timePoint = forecastByTime.find((f) => f.time === point.time);

      if (timePoint) {
        timePoint.forecast.push(point);
      } else {
        forecastByTime.push({
          time: point.time,
          forecast: [point],
        });
      }
    }

    return forecastByTime;
  }
}
