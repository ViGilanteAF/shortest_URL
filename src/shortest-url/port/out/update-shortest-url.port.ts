export abstract class UpdateShortestUrlPort {
  abstract increaseVisitCountByKey(shortestUrlKey: string): Promise<void>;
}
