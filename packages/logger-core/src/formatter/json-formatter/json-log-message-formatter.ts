import { ILogMessageFormatter, ILogMessageScope } from '../../logger.js';

export class JsonLogMessageFormatter implements ILogMessageFormatter {
  format(scope: ILogMessageScope): string {
    return JSON.stringify(scope);
  }
}
