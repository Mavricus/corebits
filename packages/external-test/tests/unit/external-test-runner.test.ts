import * as sinon from 'sinon';
import { TestRunnerMock } from '../mock/test-runner.mock.js';
import { ExternalTestRunner } from '../../src/index.js';
import { ExternalTestMock } from '../mock/external-test.mock.js';
import { ExternalTestDescribeMock } from '../mock/external-test-describe.mock.js';

describe('ExternalTestRunner', () => {
  let externalTestRunner: ExternalTestRunner;
  let testRunner: TestRunnerMock;
  let test: ExternalTestMock;
  let testDescribe: ExternalTestDescribeMock;

  beforeEach(() => {
    testRunner = new TestRunnerMock();
    testRunner.mocks.describe.returns(undefined);
    testRunner.mocks.it.returns(undefined);
    testRunner.mocks.beforeAll.returns(undefined);
    testRunner.mocks.afterAll.returns(undefined);
    testRunner.mocks.beforeEach.returns(undefined);
    testRunner.mocks.afterEach.returns(undefined);

    test = new ExternalTestMock();
    test.mocks.test.returns(undefined);

    testDescribe = new ExternalTestDescribeMock();
    testDescribe.items.push(test);
    testDescribe.mocks.beforeAll.returns(undefined);
    testDescribe.mocks.afterAll.returns(undefined);
    testDescribe.mocks.beforeEach.returns(undefined);
    testDescribe.mocks.afterEach.returns(undefined);

    externalTestRunner = new ExternalTestRunner(testRunner);
  });

  describe('runTest', () => {
    it('should call it with correct arguments for a test', async () => {
      externalTestRunner.runTest(test);
      await testRunner.execute();

      expect(testRunner.mocks.it.calledWith(test.description, sinon.match.func)).toBe(true);
    });

    it('should execute the test function when called', async () => {
      externalTestRunner.runTest(test);
      await testRunner.execute();

      expect(test.mocks.test.called).toBe(true);
    });
  });

  describe('run', () => {
    it('should call describe with correct arguments', async () => {
      externalTestRunner.run(testDescribe);
      await testRunner.execute();

      expect(testRunner.mocks.describe.calledWith(testDescribe.description, sinon.match.func)).toBe(true);
    });

    it('should call beforeAll if provided', async () => {
      testDescribe.mocks.beforeAll.returns(undefined);
      externalTestRunner.run(testDescribe);
      await testRunner.execute();

      expect(testDescribe.mocks.beforeAll.called).toBe(true);
    });

    it('should call afterAll if provided', async () => {
      testDescribe.mocks.afterAll.returns(undefined);
      externalTestRunner.run(testDescribe);
      await testRunner.execute();

      expect(testDescribe.mocks.afterAll.called).toBe(true);
    });

    it('should call beforeEach if provided', async () => {
      testDescribe.mocks.beforeEach.returns(undefined);
      externalTestRunner.run(testDescribe);
      await testRunner.execute();

      expect(testDescribe.mocks.beforeEach.called).toBe(true);
    });

    it('should call afterEach if provided', async () => {
      testDescribe.mocks.afterEach.returns(undefined);
      externalTestRunner.run(testDescribe);
      await testRunner.execute();

      expect(testDescribe.mocks.afterEach.called).toBe(true);
    });

    it('should run nested tests', async () => {
      const nestedTest = new ExternalTestMock();
      testDescribe.items = [nestedTest];

      externalTestRunner.run(testDescribe);
      await testRunner.execute();

      expect(testRunner.mocks.it.calledWith(nestedTest.description, sinon.match.func)).toBe(true);
    });

    it('should run nested describe blocks', async () => {
      const nestedDescribe = new ExternalTestDescribeMock();
      testDescribe.items = [nestedDescribe];

      externalTestRunner.run(testDescribe);
      await testRunner.execute();

      expect(testRunner.mocks.describe.calledWith(nestedDescribe.description, sinon.match.func)).toBe(true);
    });

    it('should execute hooks in correct order', async () => {
      const executionOrder: string[] = [];

      testDescribe.mocks.beforeAll.callsFake(() => executionOrder.push('beforeAll'));
      testDescribe.mocks.beforeEach.callsFake(() => executionOrder.push('beforeEach'));
      test.mocks.test.callsFake(() => executionOrder.push('test'));
      testDescribe.mocks.afterEach.callsFake(() => executionOrder.push('afterEach'));
      testDescribe.mocks.afterAll.callsFake(() => executionOrder.push('afterAll'));

      externalTestRunner.run(testDescribe);
      await testRunner.execute();

      expect(executionOrder).toEqual(['beforeAll', 'beforeEach', 'test', 'afterEach', 'afterAll']);
    });

    it('should execute hooks for nested describes in correct order', async () => {
      const executionOrder: string[] = [];
      const nestedDescribe = new ExternalTestDescribeMock();
      const nestedTest = new ExternalTestMock();
      nestedDescribe.items.push(nestedTest);
      testDescribe.items = [nestedDescribe];

      testDescribe.mocks.beforeAll.callsFake(() => executionOrder.push('parent beforeAll'));
      testDescribe.mocks.beforeEach.callsFake(() => executionOrder.push('parent beforeEach'));
      nestedDescribe.mocks.beforeAll.callsFake(() => executionOrder.push('nested beforeAll'));
      nestedDescribe.mocks.beforeEach.callsFake(() => executionOrder.push('nested beforeEach'));
      nestedTest.mocks.test.callsFake(() => executionOrder.push('nested test'));
      nestedDescribe.mocks.afterEach.callsFake(() => executionOrder.push('nested afterEach'));
      nestedDescribe.mocks.afterAll.callsFake(() => executionOrder.push('nested afterAll'));
      testDescribe.mocks.afterEach.callsFake(() => executionOrder.push('parent afterEach'));
      testDescribe.mocks.afterAll.callsFake(() => executionOrder.push('parent afterAll'));

      externalTestRunner.run(testDescribe);
      await testRunner.execute();

      expect(executionOrder).toEqual([
        'parent beforeAll',
        'nested beforeAll',
        'parent beforeEach',
        'nested beforeEach',
        'nested test',
        'nested afterEach',
        'parent afterEach',
        'nested afterAll',
        'parent afterAll',
      ]);
    });
  });
});
