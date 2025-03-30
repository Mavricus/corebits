import { ILogger, ILoggerConfig } from '../logger.js';
import { ILoggerFactory } from './logger-factory.js';
export declare class BasicLoggerFactory implements ILoggerFactory {
    private readonly writer;
    private readonly formatter;
    create(config: ILoggerConfig): ILogger;
}
//# sourceMappingURL=basic-logger-factory.d.ts.map