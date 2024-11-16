import { IMiddleware, MiddlewareManager } from '@flex/middleware';
import { BaseError, IBaseErrorContext } from '@flex/base-error';

export enum LogLevel {
  CRITICAL = 60,
  ERROR = 50,
  WARN = 40,
  INFO = 30,
  DEBUG = 20,
  TRACE = 10,
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

export const NO_CONTEXT = 'no-context';

export interface IBuildScope {
  (scope: ILogMessageScope): ILogMessageScope;
}

export class Logger implements ILogger {
  private level: LogLevel;
  private readonly context: string;
  private readonly middlewares;

  constructor(
    private readonly config: ILoggerConfig,
    private readonly formatter: ILogMessageFormatter,
    private readonly writer: ILogMessageWriter,
  ) {
    this.level = config.level ?? LogLevel.INFO;
    this.context = config.context ?? NO_CONTEXT;
    this.middlewares = new MiddlewareManager<IBuildScope>((i) => i);
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
    if (level <= this.level) {
      return;
    }

    const scope = this.middlewares.execute(this.buildScope(level, message, details));

    this.writer.write(level, this.formatter.format(scope));
  }

  setLogLevel(level: LogLevel): void {
    this.level = level;
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
