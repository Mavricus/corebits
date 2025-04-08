import { JsonLogMessageFormatter } from '../formatter/json-formatter/json-log-message-formatter.js';
import { StreamLogMessageWriter } from '../writer/stream-writer/stream-log-message-writer.js';
import { LoggerFactory } from './logger-factory.js';

export class StreamLoggerFactory extends LoggerFactory {
  constructor(log: NodeJS.WritableStream, error?: NodeJS.WritableStream) {
    super(new JsonLogMessageFormatter(), new StreamLogMessageWriter(log, error));
  }
}
