import { ILoggerConfig, ILogMessageFormatter, ILogMessageWriter, Logger } from '../logger.js';

export interface ILoggerFactory {
  create(config: ILoggerConfig): Logger;
}

export class LoggerFactory implements ILoggerFactory {
  constructor(
    private readonly formater: ILogMessageFormatter,
    private readonly writer: ILogMessageWriter,
  ) {}

  create(config: ILoggerConfig = {}): Logger {
    return new Logger(config, this.formater, this.writer);
  }
}
