export abstract class GetOriginalUrlUseCase {
  abstract execute(shortestUrlKey: string): Promise<string>;
}
