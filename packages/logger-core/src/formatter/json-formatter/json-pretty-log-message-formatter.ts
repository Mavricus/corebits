import { ILogMessageFormatter, ILogMessageScope } from '../../logger.js';

export class JsonPrettyLogMessageFormatter implements ILogMessageFormatter {
  format(scope: ILogMessageScope): string {
    return JSON.stringify(scope, null, 2);
  }
}
