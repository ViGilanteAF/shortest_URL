import { Builder } from '../../util/builder.util';

export class ShortestUrl {
  readonly id: string;
  readonly key: string;
  readonly originalUrl: string;
  readonly visitCount: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  static builder() {
    return new Builder(this);
  }
}
