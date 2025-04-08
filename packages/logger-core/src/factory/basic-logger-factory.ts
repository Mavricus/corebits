import { ConsoleLogMessageWriter } from '../writer/console-writer/console-log-message-writer.js';
import { JsonLogMessageFormatter } from '../formatter/json-formatter/json-log-message-formatter.js';
import { LoggerFactory } from './logger-factory.js';

export class BasicLoggerFactory extends LoggerFactory {
  constructor() {
    super(new JsonLogMessageFormatter(), new ConsoleLogMessageWriter());
  }
}
