import { GetOriginalUrlQuery } from './get-original-url.query';

export abstract class GetOriginalUrlUseCase {
  abstract execute(qeury: GetOriginalUrlQuery): Promise<string>;
}
