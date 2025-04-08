import { ILogMessageFormatter, ILogMessageScope } from '@corebits/logger-core';
import * as sinon from 'sinon';

export class LogFormatterMock implements ILogMessageFormatter {
  mocks = {
    format: sinon.stub(),
  };

  format(scope: ILogMessageScope): string {
    return this.mocks.format(scope);
  }
}
