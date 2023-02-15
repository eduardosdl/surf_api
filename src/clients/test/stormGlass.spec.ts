import { StormGlass } from '@src/clients/stormGlass';
import * as HTTPUtil from '@src/utils/request';

import * as stormGlassWeather3HoursFixture from '@test/fixtures/stormglass_weather_3_hours.json';
import stormGlassNormalized3HoursFixtureGlass from '@test/fixtures/stormGlass_response_3_hours.json';

jest.mock('@src/utils/request');

describe('StormGlass client', () => {
  const mockedRequestClass = HTTPUtil.Request as jest.Mocked<
    typeof HTTPUtil.Request
  >;
  const mockedRequest = new HTTPUtil.Request() as jest.Mocked<HTTPUtil.Request>;

  it('should return be the normalized forecast from the StormGlass service', async () => {
    const lat = -8.05428;
    const lng = -34.8813;

    mockedRequest.get.mockResolvedValue({
      data: stormGlassWeather3HoursFixture,
    } as HTTPUtil.Response);

    const stormGlass = new StormGlass(mockedRequest);
    const response = await stormGlass.fetchPoints(lat, lng);
    expect(response).toEqual(stormGlassNormalized3HoursFixtureGlass);
  });

  it('should exclude incomplete data points', async () => {
    const lat = -8.05428;
    const lng = -34.8813;
    const incompleteResponse = {
      hours: [
        {
          windDirection: {
            noaa: 300,
          },
        },
      ],
    };

    mockedRequest.get.mockResolvedValue({
      data: incompleteResponse,
    } as HTTPUtil.Response);

    const stormGlass = new StormGlass(mockedRequest);
    const response = await stormGlass.fetchPoints(lat, lng);

    expect(response).toEqual([]);
  });

  it('Should get a generic error from StormGlass service when the request fail before reachingthe service', async () => {
    const lat = -8.05428;
    const lng = -34.8813;

    mockedRequest.get.mockRejectedValue({ message: 'Network Error' });

    const stormGlass = new StormGlass(mockedRequest);
    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpect error when trying to communicate to StormGlass: Network Error'
    );
  });

  it('should get an StormGlassResponseError when the StormGlass service responds with error', async () => {
    const lat = -8.05428;
    const lng = -34.8813;

    mockedRequestClass.isRequestError.mockReturnValue(true);

    mockedRequest.get.mockRejectedValue({
      response: {
        status: 429,
        data: { errors: ['Rate Limit reached'] },
      },
    });

    const stormGlass = new StormGlass(mockedRequest);
    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpect error when trying to communicate to StormGlass: Error: {"errors":["Rate Limit reached"]} Code: 429'
    );
  });
});
