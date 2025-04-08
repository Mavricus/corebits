import { ILogMessageFormatter, ILogMessageScope, LogLevel } from '@corebits/logger-core';
import chalk, { ChalkInstance } from 'chalk';

export interface IPrettyLogMessageFormatterConfig {
  colorize?: boolean;
  colorSchema?: IColorSchema;
}

export interface IColorMap {
  level: ChalkInstance;
  date: ChalkInstance;
  message: ChalkInstance;
  context: ChalkInstance;
  error: ChalkInstance;
  data: ChalkInstance;
}

export type IColorSchema = {
  [key in LogLevel]: IColorMap;
};

export const defaultColorsSchema: IColorSchema = {
  [LogLevel.CRITICAL]: {
    level: chalk.bgRedBright.underline.italic,
    date: chalk.bgRedBright.underline.italic,
    message: chalk.bgRedBright.italic.underline,
    context: chalk.bgRedBright.italic.underline,
    error: chalk.redBright.italic,
    data: chalk.redBright,
  },
  [LogLevel.ERROR]: {
    level: chalk.bgRed.underline,
    date: chalk.red.underline,
    message: chalk.bgRed.underline,
    context: chalk.red.underline,
    error: chalk.red.italic,
    data: chalk.red,
  },
  [LogLevel.WARN]: {
    level: chalk.bgYellow.underline,
    date: chalk.yellow.underline,
    message: chalk.bgYellow.underline,
    context: chalk.yellow.underline,
    error: chalk.yellow.italic,
    data: chalk.yellow,
  },
  [LogLevel.INFO]: {
    level: chalk.bgGreen.underline,
    date: chalk.green.underline,
    message: chalk.bgGreen.underline,
    context: chalk.green.underline,
    error: chalk.green.italic,
    data: chalk.green,
  },
  [LogLevel.DEBUG]: {
    level: chalk.bgGray.underline,
    date: chalk.grey.underline,
    message: chalk.bgGrey.underline,
    context: chalk.grey.underline,
    error: chalk.grey.italic,
    data: chalk.grey,
  },
  [LogLevel.TRACE]: {
    level: chalk.grey.italic,
    date: chalk.grey.italic,
    message: chalk.grey.italic,
    context: chalk.grey.italic,
    error: chalk.grey.italic,
    data: chalk.grey.italic,
  },
  [LogLevel.SILENT]: {
    level: chalk.grey.italic,
    date: chalk.grey.italic,
    message: chalk.grey.italic,
    context: chalk.grey.italic,
    error: chalk.grey.italic,
    data: chalk.grey.italic,
  },
};

export class PrettyLogMessageFormatter implements ILogMessageFormatter {
  private readonly colorize: boolean;
  private readonly colorSchema: IColorSchema;

  constructor(config: IPrettyLogMessageFormatterConfig = {}) {
    this.colorize = config.colorize ?? true;
    this.colorSchema = config.colorSchema ?? defaultColorsSchema;
  }

  format(scope: ILogMessageScope): string {
    const { level, time, message, context, error, data } = this.getFormattedScope(scope);
    const parts = [level, time];
    if (context) {
      parts.push(context);
    }
    parts.push(message);
    return `${parts.join(' ')}${error ? `\n${error}` : ''}${data ? `\n${data}` : ''}`;
  }

  private getFormattedScope(scope: ILogMessageScope): {
    level: string;
    time: string;
    message: string;
    context?: string;
    error?: string;
    data: string;
  } {
    const { level, timestamp, message, context, details, ...rest } = scope;
    const levelName = this.pad(level.toUpperCase(), 10);
    const errorMessage = this.getErrorMessage(details.error);
    const time = new Date(timestamp).toISOString();
    const data = JSON.stringify(rest, null, 2);
    const messageContext = context ? `${context}:` : undefined;

    if (!this.colorize) {
      return { level: levelName, time, message, context: messageContext, error: errorMessage, data };
    }

    return {
      level: this.colorSchema[level].level(levelName),
      time: this.colorSchema[level].date(timestamp),
      message: this.colorSchema[level].message(message),
      context: context ? this.colorSchema[level].context(messageContext) : undefined,
      error: errorMessage ? this.colorSchema[level].error(errorMessage) : undefined,
      data: this.colorSchema[level].data(data),
    };
  }

  private getErrorMessage(error?: { name?: string; message?: string; stack?: string }): string | undefined {
    if (!error) {
      return undefined;
    }

    if (error?.stack) {
      return error.stack;
    }

    const parts: Array<string> = [];
    if (error?.name) {
      parts.push(error.name);
    }
    if (error?.message) {
      parts.push(error.message);
    }

    return parts.length ? parts.join(': ') : undefined;
  }

  private pad(str: string, length: number, char = ' '): string {
    return str.padStart((str.length + length) / 2, char).padEnd(length, char);
  }
}
