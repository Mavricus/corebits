import * as console from 'node:console';
import { LogLevel } from '../../logger.js';
export class ConsoleLogMessageWriter {
    write(level, message) {
        if (level < LogLevel.ERROR) {
            return console.log(message);
        }
        console.error(message);
    }
}
