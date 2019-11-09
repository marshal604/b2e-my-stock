export interface ThrottlePayload {
  requestPerSecond: number;
}
export enum ThrottleRequestPerSecond {
  Default = 5
}
let instance: Throttle | null = null;
export class Throttle {
  list: Function[] = [];
  timer!: NodeJS.Timeout | null;
  constructor(private payload: ThrottlePayload) {
    if (!instance) {
      instance = this;
    }
    return instance;
  }

  add(fn: Function) {
    this.list.push(fn);
    this.checkThrottleList();
  }

  checkThrottleList() {
    if (this.timer) {
      return;
    }
    this.timer = <NodeJS.Timeout>setTimeout(() => {
      const fn = this.list.shift();
      if (!fn) {
        return;
      }
      fn();
      this.timer = null;
      this.checkThrottleList();
    }, this.payload.requestPerSecond * 1_000);
  }
}
