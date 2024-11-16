import * as console from 'node:console';
import { ILogMessageWriter, LogLevel } from '../../logger.js';

export class ConsoleLogMessageWriter implements ILogMessageWriter {
  write(level: LogLevel, message: string): void {
    if (level < LogLevel.ERROR) {
      return console.log(message);
    }

    console.error(message);
  }
}
