import { Builder } from '../../../common/util/builder.util';

export class GetOriginalUrlQuery {
  readonly shortestUrlKey: string;

  static builder() {
    return new Builder(this);
  }
}
