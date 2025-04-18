export interface IExternalTestDescribe {
  description: string;
  items: IExternalDescribeItem[];
  beforeAll?: () => void | Promise<void>;
  afterAll?: () => void | Promise<void>;
  beforeEach?: () => void | Promise<void>;
  afterEach?: () => void | Promise<void>;
}

export interface IExternalTest {
  description: string;
  timeout?: number;

  test: IExternalTestCallback;
}

export type IExternalDescribeItem = IExternalTestDescribe | IExternalTest;

export type IExternalTestCallback =
  | ((cb?: { (...args: any[]): any; fail(error?: string | { message: string }): any }) => void | undefined)
  | (() => PromiseLike<unknown>);

export interface ITestRunner {
  describe(description: string, fn: () => void): void;

  it(description: string, fn?: IExternalTestCallback, timeout?: number): void;

  beforeAll(fn: () => void | Promise<void>): void;

  afterAll(fn: () => void | Promise<void>): void;

  beforeEach(fn: () => void | Promise<void>): void;

  afterEach(fn: () => void | Promise<void>): void;
}
