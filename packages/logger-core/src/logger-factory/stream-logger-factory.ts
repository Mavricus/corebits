import { ILogger, ILoggerConfig, ILogMessageWriter, Logger } from '../logger.js';
import { JsonLogMessageFormatter } from '../formatter/json-formatter/json-log-message-formatter.js';
import { StreamLogMessageWriter } from '../writer/stream-writer/stream-log-message-writer.js';
import { ILoggerFactory } from './logger-factory.js';

export class StreamLoggerFactory implements ILoggerFactory {
  private readonly formatter = new JsonLogMessageFormatter();
  private readonly writer: ILogMessageWriter;

  constructor(log: NodeJS.WritableStream, error?: NodeJS.WritableStream) {
    this.writer = new StreamLogMessageWriter(log, error);
  }

  create(config: ILoggerConfig): ILogger {
    return new Logger(config, this.formatter, this.writer);
  }
}
