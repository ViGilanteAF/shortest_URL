import { Builder } from '../../../common/util/builder.util';

export class CreateShortestUrlCommand {
  readonly originalUrl: string;

  static builder() {
    return new Builder(this);
  }
}
