import { NotFoundException } from '@nestjs/common';
import { ShortestUrl } from './domain/shortest-url';
import { GetOriginalUrlServiceImpl } from './get-original-url.service';
import { CreateShortestUrlCachePort } from './port/out/create-shortest-url-cache.port';
import { LoadShortestUrlCachePort } from './port/out/load-shortest-url-cache.port';
import { LoadShortestUrlPort } from './port/out/load-shortest-url.port';
import { UpdateShortestUrlPort } from './port/out/update-shortest-url.port';

describe('GetOriginalUrlServiceImpl', () => {
  const shortestUrl = {
    key: 'AAAAAAB',
    originalUrl: 'https://example.com',
    visitCount: 0,
  } as ShortestUrl;

  let loadShortestUrlPort: jest.Mocked<LoadShortestUrlPort>;
  let updateShortestUrlPort: jest.Mocked<UpdateShortestUrlPort>;
  let loadShortestUrlCachePort: jest.Mocked<LoadShortestUrlCachePort>;
  let createShortestUrlCachePort: jest.Mocked<CreateShortestUrlCachePort>;
  let service: GetOriginalUrlServiceImpl;

  beforeEach(() => {
    loadShortestUrlPort = {
      findShortestUrlByKey: jest.fn(),
      findShortestUrls: jest.fn(),
      count: jest.fn(),
    };
    updateShortestUrlPort = {
      increaseVisitCountByKey: jest.fn(),
    };
    loadShortestUrlCachePort = {
      findShortestUrlCache: jest.fn(),
    };
    createShortestUrlCachePort = {
      createShortestUrlCache: jest.fn(),
    };

    service = new GetOriginalUrlServiceImpl(
      loadShortestUrlPort,
      updateShortestUrlPort,
      loadShortestUrlCachePort,
      createShortestUrlCachePort,
    );
  });

  it('returns cached original url and increases visit count', async () => {
    loadShortestUrlCachePort.findShortestUrlCache.mockResolvedValue(shortestUrl);

    await expect(service.execute(shortestUrl.key)).resolves.toBe(
      shortestUrl.originalUrl,
    );

    expect(loadShortestUrlPort.findShortestUrlByKey).not.toHaveBeenCalled();
    expect(createShortestUrlCachePort.createShortestUrlCache).not.toHaveBeenCalled();
    expect(updateShortestUrlPort.increaseVisitCountByKey).toHaveBeenCalledWith(
      shortestUrl.key,
    );
  });

  it('loads from database and creates cache when cache misses', async () => {
    loadShortestUrlCachePort.findShortestUrlCache.mockResolvedValue(null);
    loadShortestUrlPort.findShortestUrlByKey.mockResolvedValue(shortestUrl);

    await expect(service.execute(shortestUrl.key)).resolves.toBe(
      shortestUrl.originalUrl,
    );

    expect(loadShortestUrlPort.findShortestUrlByKey).toHaveBeenCalledWith(
      shortestUrl.key,
    );
    expect(createShortestUrlCachePort.createShortestUrlCache).toHaveBeenCalledWith(
      shortestUrl,
    );
    expect(updateShortestUrlPort.increaseVisitCountByKey).toHaveBeenCalledWith(
      shortestUrl.key,
    );
  });

  it('throws not found when cache and database both miss', async () => {
    loadShortestUrlCachePort.findShortestUrlCache.mockResolvedValue(null);
    loadShortestUrlPort.findShortestUrlByKey.mockResolvedValue(null);

    await expect(service.execute(shortestUrl.key)).rejects.toBeInstanceOf(
      NotFoundException,
    );

    expect(createShortestUrlCachePort.createShortestUrlCache).not.toHaveBeenCalled();
    expect(updateShortestUrlPort.increaseVisitCountByKey).not.toHaveBeenCalled();
  });
});
