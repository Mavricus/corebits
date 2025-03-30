import { ConsoleLogMessageWriter } from '../writer/console-writer/console-log-message-writer.js';
import { JsonLogMessageFormatter } from '../formatter/json-formatter/json-log-message-formatter.js';
import { ILogger, ILoggerConfig, Logger } from '../logger.js';
import { ILoggerFactory } from './logger-factory.js';

export class BasicLoggerFactory implements ILoggerFactory {
  private readonly writer = new ConsoleLogMessageWriter();
  private readonly formatter = new JsonLogMessageFormatter();

  create(config: ILoggerConfig): ILogger {
    return new Logger(config, this.formatter, this.writer);
  }
}
