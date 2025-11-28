export abstract class LoadUpdateCountPort {
  abstract findCountIncrease(increase: number): Promise<number>;
}
