import { ILogger, ILoggerConfig } from '../logger.js';
import { ILoggerFactory } from './logger-factory.js';
export declare class StreamLoggerFactory implements ILoggerFactory {
    private readonly formatter;
    private readonly writer;
    constructor(log: NodeJS.WritableStream, error?: NodeJS.WritableStream);
    create(config: ILoggerConfig): ILogger;
}
//# sourceMappingURL=stream-logger-factory.d.ts.map