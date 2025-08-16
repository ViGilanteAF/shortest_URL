export abstract class CountCommandPort {
  abstract findCountAndIncreate(): Promise<number>;
}
