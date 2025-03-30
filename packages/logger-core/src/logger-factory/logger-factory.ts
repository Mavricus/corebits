import { ILogger, ILoggerConfig, ILogMessageFormatter, ILogMessageWriter, Logger } from '../logger.js';

export interface ILoggerFactory {
  create(config: ILoggerConfig): ILogger;
}

export class LoggerFactory implements ILoggerFactory {
  constructor(
    private readonly formater: ILogMessageFormatter,
    private readonly writer: ILogMessageWriter,
  ) {}

  create(config: ILoggerConfig): ILogger {
    return new Logger(config, this.formater, this.writer);
  }
}
