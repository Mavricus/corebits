import { ILogger, ILoggerConfig, ILogMessageFormatter, ILogMessageWriter } from '../logger.js';
export interface ILoggerFactory {
    create(config: ILoggerConfig): ILogger;
}
export declare class LoggerFactory implements ILoggerFactory {
    private readonly formater;
    private readonly writer;
    constructor(formater: ILogMessageFormatter, writer: ILogMessageWriter);
    create(config: ILoggerConfig): ILogger;
}
//# sourceMappingURL=logger-factory.d.ts.map