import { Builder } from '../../../util/builder.util';

export class GetShortestUrlsQuery {
  readonly pageNumber: number;
  readonly pageSize: number;

  static builder() {
    return new Builder(this);
  }
}
