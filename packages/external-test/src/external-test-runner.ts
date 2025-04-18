import { IExternalDescribeItem, IExternalTest, IExternalTestDescribe, ITestRunner } from './types.js';

export interface IExternalTestRunner {
  run: (describe: IExternalTestDescribe) => void;
  runTest: (test: IExternalTest) => void;
}

export class ExternalTestRunner implements IExternalTestRunner {
  constructor(private readonly testRunner: ITestRunner) {}

  public run(testDescribe: IExternalTestDescribe): void {
    const { description, items } = testDescribe;
    const beforeAll = testDescribe.beforeAll?.bind(testDescribe);
    const afterAll = testDescribe.afterAll?.bind(testDescribe);
    const beforeEach = testDescribe.beforeEach?.bind(testDescribe);
    const afterEach = testDescribe.afterEach?.bind(testDescribe);

    this.testRunner.describe(description, () => {
      if (beforeAll) {
        this.testRunner.beforeAll(async () => {
          await beforeAll();
        });
      }

      if (afterAll) {
        this.testRunner.afterAll(() => afterAll());
      }

      if (beforeEach) {
        this.testRunner.beforeEach(() => beforeEach());
      }

      if (afterEach) {
        this.testRunner.afterEach(() => afterEach());
      }

      for (const item of items) {
        if (this.isTest(item)) {
          this.runTest(item);
        } else {
          this.run(item);
        }
      }
    });
  }

  public runTest(test: IExternalTest): void {
    this.testRunner.it(test.description, test.test.bind(test), test.timeout);
  }

  private isTest(item: IExternalDescribeItem): item is IExternalTest {
    return 'test' in item;
  }
}
