import { ShortestUrl } from '../domain/shortest-url';
import { ShortestUrlEntity } from './shortest-url.entity';

export abstract class ShortestUrlMapper {
  static entityToDomain(entity: ShortestUrlEntity): ShortestUrl {
    return ShortestUrl.builder()
      .set('id', String(entity._id))
      .set('key', entity.key)
      .set('originalUrl', entity.originalUrl)
      .set('visitCount', entity.visitCount)
      .set('createdAt', entity.createdAt)
      .set('updatedAt', entity.updatedAt)
      .build();
  }
}
