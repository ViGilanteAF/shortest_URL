type ResolveFunction = () => void;

export class Mutex {
  private locked: boolean;
  private waitingQueue: ResolveFunction[];

  constructor() {
    this.locked = false;
    this.waitingQueue = [];
  }

  async lock(): Promise<void> {
    if (this.locked) {
      await new Promise((resolve) =>
        this.waitingQueue.push(<ResolveFunction>resolve),
      );
    } else {
      this.locked = true;
    }
  }

  unlock(): void {
    if (this.waitingQueue.length > 0) {
      const nextResolve = this.waitingQueue.shift();
      if (nextResolve) {
        nextResolve();
      }
    } else {
      this.locked = false;
    }
  }
}
