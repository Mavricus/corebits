import { ConsoleLogMessageWriter } from '../writer/console-writer/console-log-message-writer.js';
import { JsonLogMessageFormatter } from '../formatter/json-formatter/json-log-message-formatter.js';
import { Logger } from '../logger.js';
export class BasicLoggerFactory {
    writer = new ConsoleLogMessageWriter();
    formatter = new JsonLogMessageFormatter();
    create(config) {
        return new Logger(config, this.formatter, this.writer);
    }
}
