import { ILogMessageWriter, LogLevel } from '../../logger.js';
export declare class StreamLogMessageWriter implements ILogMessageWriter {
    private readonly log;
    private readonly error;
    constructor(log: NodeJS.WritableStream, error?: NodeJS.WritableStream);
    write(level: LogLevel, message: string): void;
}
//# sourceMappingURL=stream-log-message-writer.d.ts.map