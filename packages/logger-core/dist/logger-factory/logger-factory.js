import { Logger } from '../logger.js';
export class LoggerFactory {
    formater;
    writer;
    constructor(formater, writer) {
        this.formater = formater;
        this.writer = writer;
    }
    create(config) {
        return new Logger(config, this.formater, this.writer);
    }
}
