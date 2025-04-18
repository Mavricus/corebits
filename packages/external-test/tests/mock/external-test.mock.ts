import * as sinon from 'sinon';
import { IExternalTest } from '../../src/index.js';

export class ExternalTestMock implements IExternalTest {
  description = 'Test description';

  mocks = {
    test: sinon.stub(),
  };

  test(): Promise<void> {
    return this.mocks.test();
  }
}
