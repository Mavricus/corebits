import SonicBoom from 'sonic-boom';
import { ILogMessageWriter, LogLevel, logLevelPriority } from '@corebits/logger-core';

export class SonicBoomLogWriter implements ILogMessageWriter {
  private readonly errorStream: SonicBoom.SonicBoom;

  constructor(
    private readonly logStream: SonicBoom.SonicBoom,
    errorStream?: SonicBoom.SonicBoom,
  ) {
    if (errorStream == null) {
      this.errorStream = this.logStream;
    } else {
      this.errorStream = errorStream;
    }
  }

  write(level: LogLevel, message: string): void {
    let stream = this.logStream;
    if (logLevelPriority[level] >= logLevelPriority[LogLevel.ERROR]) {
      stream = this.errorStream;
    }

    stream.write(message);
    stream.write('\n');
  }

  close(): Promise<void> {
    this.logStream.flushSync();
    this.logStream.destroy();

    if (this.logStream !== this.errorStream) {
      this.errorStream.flushSync();
      this.errorStream.destroy();
    }
    return Promise.resolve();
  }
}
