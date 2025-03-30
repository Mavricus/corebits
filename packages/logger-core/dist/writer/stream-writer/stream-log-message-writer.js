import { LogLevel } from '../../logger.js';
export class StreamLogMessageWriter {
    log;
    error;
    constructor(log, error) {
        this.log = log;
        this.error = error ?? log;
    }
    write(level, message) {
        if (level < LogLevel.ERROR) {
            this.log.write(message);
        }
        else {
            this.error.write(message);
        }
        this.log.write('\n');
    }
}
