import { IMiddleware } from '@flex/middleware';
export declare enum LogLevel {
    CRITICAL = 60,
    ERROR = 50,
    WARN = 40,
    INFO = 30,
    DEBUG = 20,
    TRACE = 10
}
export interface ILogDetails extends Record<string, unknown> {
    error?: Error;
}
export interface IErrorLogDetails extends ILogDetails {
    error: Error;
}
export type ErrorLogLevel = LogLevel.CRITICAL | LogLevel.ERROR;
export type InfoLogLevel = Exclude<LogLevel, ErrorLogLevel>;
export interface ILogger {
    critical(message: string, details: IErrorLogDetails): void;
    error(message: string, details: IErrorLogDetails): void;
    warn(message: string, details: ILogDetails): void;
    info(message: string, details: ILogDetails): void;
    debug(message: string, details: ILogDetails): void;
    trace(message: string, details: ILogDetails): void;
    log(level: ErrorLogLevel, message: string, details: IErrorLogDetails): void;
    log(level: InfoLogLevel, message: string, details: ILogDetails): void;
    setLogLevel(level: LogLevel): void;
}
export interface ILoggerConfig {
    level?: LogLevel;
    context?: string;
}
export interface ILogMessageErrorScope {
    message: string;
    name: string;
    stack: string;
    context: unknown;
}
export interface ILogMessageScope {
    level: LogLevel;
    message: string;
    timestamp: Date;
    service?: string;
    version?: string;
    traceId?: string;
    spanId?: string;
    context?: string;
    userId?: string;
    details: {
        [key: string]: unknown;
        error?: ILogMessageErrorScope;
    };
}
export interface ILogMessageFormatter {
    format(scope: ILogMessageScope): string;
}
export interface ILogMessageWriter {
    write(level: LogLevel, message: string): void;
}
export declare const NO_CONTEXT = "no-context";
export interface IBuildScope {
    (scope: ILogMessageScope): ILogMessageScope;
}
export declare class Logger implements ILogger {
    private readonly config;
    private readonly formatter;
    private readonly writer;
    private level;
    private readonly context;
    private readonly middlewares;
    constructor(config: ILoggerConfig, formatter: ILogMessageFormatter, writer: ILogMessageWriter);
    critical(message: string, details: IErrorLogDetails): void;
    error(message: string, details: IErrorLogDetails): void;
    warn(message: string, details: ILogDetails): void;
    info(message: string, details: ILogDetails): void;
    debug(message: string, details: ILogDetails): void;
    trace(message: string, details: ILogDetails): void;
    log(level: LogLevel, message: string, details: ILogDetails): void;
    setLogLevel(level: LogLevel): void;
    use(middleware: IMiddleware<IBuildScope>): this;
    private buildScope;
}
//# sourceMappingURL=logger.d.ts.map