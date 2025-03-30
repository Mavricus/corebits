import { Logger } from '../logger.js';
import { JsonLogMessageFormatter } from '../formatter/json-formatter/json-log-message-formatter.js';
import { StreamLogMessageWriter } from '../writer/stream-writer/stream-log-message-writer.js';
export class StreamLoggerFactory {
    formatter = new JsonLogMessageFormatter();
    writer;
    constructor(log, error) {
        this.writer = new StreamLogMessageWriter(log, error);
    }
    create(config) {
        return new Logger(config, this.formatter, this.writer);
    }
}
