import { MiddlewareManager } from '@flex/middleware';
export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["CRITICAL"] = 60] = "CRITICAL";
    LogLevel[LogLevel["ERROR"] = 50] = "ERROR";
    LogLevel[LogLevel["WARN"] = 40] = "WARN";
    LogLevel[LogLevel["INFO"] = 30] = "INFO";
    LogLevel[LogLevel["DEBUG"] = 20] = "DEBUG";
    LogLevel[LogLevel["TRACE"] = 10] = "TRACE";
})(LogLevel || (LogLevel = {}));
export const NO_CONTEXT = 'no-context';
export class Logger {
    config;
    formatter;
    writer;
    level;
    context;
    middlewares;
    constructor(config, formatter, writer) {
        this.config = config;
        this.formatter = formatter;
        this.writer = writer;
        this.level = config.level ?? LogLevel.INFO;
        this.context = config.context ?? NO_CONTEXT;
        this.middlewares = new MiddlewareManager((i) => i);
    }
    critical(message, details) {
        this.log(LogLevel.CRITICAL, message, details);
    }
    error(message, details) {
        this.log(LogLevel.ERROR, message, details);
    }
    warn(message, details) {
        this.log(LogLevel.WARN, message, details);
    }
    info(message, details) {
        this.log(LogLevel.INFO, message, details);
    }
    debug(message, details) {
        this.log(LogLevel.DEBUG, message, details);
    }
    trace(message, details) {
        this.log(LogLevel.TRACE, message, details);
    }
    log(level, message, details) {
        if (level <= this.level) {
            return;
        }
        const scope = this.middlewares.execute(this.buildScope(level, message, details));
        this.writer.write(level, this.formatter.format(scope));
    }
    setLogLevel(level) {
        this.level = level;
    }
    use(middleware) {
        this.middlewares.add(middleware);
        return this;
    }
    buildScope(level, message, details) {
        let error = details.error;
        if (error instanceof Error) {
            error = {
                message: error.message,
                name: error.name,
                stack: error.stack,
                context: error.context,
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
