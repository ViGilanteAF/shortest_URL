import { CountService } from '../count.service';

export class Count {
  start = 0;
  current = 0;
  end = 0;

  isFinished() {
    return this.current === this.end;
  }

  increaseCurrentCount() {
    this.current++;
  }

  setCount(start: number) {
    this.start = start;
    this.current = this.start;
    this.end = this.start + CountService.COUNT_RANGE - 1;
  }
}
