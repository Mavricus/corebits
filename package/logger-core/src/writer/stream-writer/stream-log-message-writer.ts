import { ILogMessageWriter, LogLevel } from '../../logger.js';

export class StreamLogMessageWriter implements ILogMessageWriter {
  private readonly log: NodeJS.WritableStream;
  private readonly error: NodeJS.WritableStream;

  constructor(log: NodeJS.WritableStream, error?: NodeJS.WritableStream) {
    this.log = log;
    this.error = error ?? log;
  }

  write(level: LogLevel, message: string): void {
    if (level < LogLevel.ERROR) {
      this.log.write(message);
    } else {
      this.error.write(message);
    }
    this.log.write('\n');
  }
}
