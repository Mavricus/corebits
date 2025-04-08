import { IMiddleware, MiddlewareManager } from '@corebits/middleware';
import { BaseError, IBaseErrorContext } from '@corebits/base-error';

export enum LogLevel {
  CRITICAL = 'critical',
  ERROR = 'error',
  WARN = 'warning',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace',
  SILENT = 'silent',
}

export const logLevelPriority: Record<LogLevel, number> = {
  [LogLevel.CRITICAL]: 60,
  [LogLevel.ERROR]: 50,
  [LogLevel.WARN]: 40,
  [LogLevel.INFO]: 30,
  [LogLevel.DEBUG]: 20,
  [LogLevel.TRACE]: 10,
  [LogLevel.SILENT]: Infinity,
};

export interface ILogDetails extends Record<string, unknown> {
  error?: Error;
}

export interface IErrorLogDetails extends ILogDetails {
  error: Error;
}

export type ErrorLogLevel = LogLevel.CRITICAL | LogLevel.ERROR;
export type InfoLogLevel = Exclude<LogLevel, ErrorLogLevel>;

export interface ILogger {
  get level(): LogLevel;

  set level(level: LogLevel);

  critical(message: string, details: IErrorLogDetails): void;

  error(message: string, details: IErrorLogDetails): void;

  warn(message: string, details: ILogDetails): void;

  info(message: string, details: ILogDetails): void;

  debug(message: string, details: ILogDetails): void;

  trace(message: string, details: ILogDetails): void;

  log(level: ErrorLogLevel, message: string, details: IErrorLogDetails): void;

  log(level: InfoLogLevel, message: string, details: ILogDetails): void;

  close(): Promise<void>;
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

  close(): Promise<void>;
}

export const NO_CONTEXT = 'no-context';

export interface IBuildScope {
  (scope: ILogMessageScope): ILogMessageScope;
}

export class Logger implements ILogger {
  private logLevel: LogLevel;
  private readonly context: string;
  private readonly middlewares;

  constructor(
    private readonly config: ILoggerConfig,
    private readonly formatter: ILogMessageFormatter,
    private readonly writer: ILogMessageWriter,
  ) {
    this.logLevel = config.level ?? LogLevel.INFO;
    this.context = config.context ?? NO_CONTEXT;
    this.middlewares = new MiddlewareManager<IBuildScope>((scope: ILogMessageScope) => scope);
  }

  get level(): LogLevel {
    return this.logLevel;
  }

  set level(level: LogLevel) {
    this.logLevel = level;
  }

  critical(message: string, details: IErrorLogDetails): void {
    this.log(LogLevel.CRITICAL, message, details);
  }

  error(message: string, details: IErrorLogDetails): void {
    this.log(LogLevel.ERROR, message, details);
  }

  warn(message: string, details: ILogDetails): void {
    this.log(LogLevel.WARN, message, details);
  }

  info(message: string, details: ILogDetails): void {
    this.log(LogLevel.INFO, message, details);
  }

  debug(message: string, details: ILogDetails): void {
    this.log(LogLevel.DEBUG, message, details);
  }

  trace(message: string, details: ILogDetails): void {
    this.log(LogLevel.TRACE, message, details);
  }

  log(level: LogLevel, message: string, details: ILogDetails): void {
    if (logLevelPriority[level] < logLevelPriority[this.logLevel]) {
      return;
    }

    const scope = this.middlewares.execute(this.buildScope(level, message, details));

    this.writer.write(level, this.formatter.format(scope));
  }

  close(): Promise<void> {
    return this.writer.close();
  }

  use(middleware: IMiddleware<IBuildScope>): this {
    this.middlewares.add(middleware);

    return this;
  }

  private buildScope(level: LogLevel, message: string, details: ILogDetails): ILogMessageScope {
    let error: ILogMessageErrorScope = details.error as ILogMessageErrorScope;

    if (error instanceof Error) {
      error = {
        message: error.message,
        name: error.name,
        stack: error.stack,
        context: (error as BaseError<IBaseErrorContext>).context,
      };
    }

    return {
      level,
      message,
      context: this.context,
      timestamp: new Date(),
      details: { ...details, error },
    };
  }
}
