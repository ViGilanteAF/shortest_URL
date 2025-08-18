import { Builder } from '../../../util/builder.util';

export class GetOriginalUrlQuery {
  readonly shortestUrlKey: string;

  static builder() {
    return new Builder(this);
  }
}
