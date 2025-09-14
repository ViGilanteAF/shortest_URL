import { Builder } from '../../common/util/builder.util';

export class ShortestUrl {
  readonly id: string;
  readonly key: string;
  readonly originalUrl: string;
  readonly visitCount: number = 0;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  static builder() {
    return new Builder(this);
  }
}
