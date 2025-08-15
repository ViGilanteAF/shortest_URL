export abstract class CountCommandPort {
  abstract findOneAndIncreate(): Promise<number>;
}
