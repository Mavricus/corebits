export class TimerPromise extends Promise<void> {
  constructor(timeoutMs: number) {
    super((resolve) => setTimeout(resolve, timeoutMs));
  }
}
