import * as sinon from 'sinon';
import { IExternalDescribeItem, IExternalTestDescribe } from '../../src/index.js';

export class ExternalTestDescribeMock implements IExternalTestDescribe {
  description = 'Test External Test Describe';
  items: Array<IExternalDescribeItem> = [];
  mocks = {
    beforeAll: sinon.stub(),
    afterAll: sinon.stub(),
    beforeEach: sinon.stub(),
    afterEach: sinon.stub(),
  };

  beforeAll(): void | Promise<void> {
    return this.mocks.beforeAll();
  }

  afterAll(): void | Promise<void> {
    return this.mocks.afterAll();
  }

  beforeEach(): void | Promise<void> {
    return this.mocks.beforeEach();
  }

  afterEach(): void | Promise<void> {
    return this.mocks.afterEach();
  }
}
