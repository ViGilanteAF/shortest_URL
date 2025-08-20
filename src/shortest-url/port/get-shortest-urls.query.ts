import { Builder } from '../../util/builder.util';

export class GetShortestUrlsQuery {
  readonly page: number;
  readonly pageSize: number;

  static builder() {
    return new Builder(this);
  }
}
