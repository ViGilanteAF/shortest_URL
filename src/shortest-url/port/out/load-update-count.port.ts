export abstract class LoadUpdateCountPort {
  abstract findCountIncrease(): Promise<number>;
}
