import { StormGlass } from '@src/clients/stormGlass';

import stormGlassNormalizedResponseFixture from '@test/fixtures/stormGlass_response_3_hours.json';
import {
  Beach,
  BeachPosition,
  Forecast,
  ForecastProcessingInternalError,
} from '../forecast';

jest.mock('@src/clients/stormGlass');

describe('Forecast service', () => {
  const mockedStormGlassService = new StormGlass() as jest.Mocked<StormGlass>;

  it('should return the forecast for a list of beaches', async () => {
    mockedStormGlassService.fetchPoints.mockResolvedValue(
      stormGlassNormalizedResponseFixture
    );

    const beaches: Beach[] = [
      {
        lat: -8.2601,
        lng: -34.9451,
        name: 'Paiva',
        position: BeachPosition.E,
        user: 'some-id',
      },
    ];
    const expectedResponse = [
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
      {
        time: '2023-02-12T02:00:00+00:00',
        forecast: [
          {
            lat: -8.2601,
            lng: -34.9451,
            name: 'Paiva',
            position: 'E',
            rating: 1,
            swellDirection: 89.63,
            swellHeight: 0.4,
            swellPeriod: 10.59,
            time: '2023-02-12T02:00:00+00:00',
            waveDirection: 150.47,
            waveHeight: 1.13,
            windDirection: 164.6,
            windSpeed: 1.63,
          },
        ],
      },
    ];

    const forecast = new Forecast(mockedStormGlassService);
    const beachesWithRating = await forecast.processForecastForBeaches(beaches);

    expect(beachesWithRating).toEqual(expectedResponse);
  });

  it('should return an ampty list when the beaches array is empty', async () => {
    const forecast = new Forecast();
    const response = await forecast.processForecastForBeaches([]);

    expect(response).toEqual([]);
  });

  it('should throw internal processing error when something goes wrong during the rating process', async () => {
    const beaches: Beach[] = [
      {
        lat: -8.2601,
        lng: -34.9451,
        name: 'Paiva',
        position: BeachPosition.E,
        user: 'some-id',
      },
    ];

    mockedStormGlassService.fetchPoints.mockRejectedValue(
      'Error fetching data'
    );

    const forecast = new Forecast(mockedStormGlassService);
    await expect(forecast.processForecastForBeaches(beaches)).rejects.toThrow(
      ForecastProcessingInternalError
    );
  });
});
