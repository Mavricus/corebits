import * as sinon from 'sinon';
import { IExternalTestCallback, ITestRunner } from '../../src/types.js';

interface IDescribeNode {
  type: 'describe';
  description: string;
  fn: () => void;
  children: IExecutionNode[];
  parent: IDescribeNode | null;
  hooks: {
    beforeAll: Array<() => void | Promise<void>>;
    afterAll: Array<() => void | Promise<void>>;
    beforeEach: Array<() => void | Promise<void>>;
    afterEach: Array<() => void | Promise<void>>;
  };
}

interface IItNode {
  type: 'it';
  description: string;
  fn: IExternalTestCallback;
  parent: IDescribeNode;
}

interface ISetupNode {
  type: 'beforeAll' | 'afterAll' | 'beforeEach' | 'afterEach';
  fn: () => void | Promise<void>;
  parent: IDescribeNode;
}

type IExecutionNode = IDescribeNode | IItNode | ISetupNode;

export class TestRunnerMock implements ITestRunner {
  mocks = {
    describe: sinon.stub(),
    it: sinon.stub(),
    beforeAll: sinon.stub(),
    afterAll: sinon.stub(),
    beforeEach: sinon.stub(),
    afterEach: sinon.stub(),
  };

  private root: IDescribeNode = {
    type: 'describe',
    description: 'root',
    fn: () => undefined,
    children: [],
    parent: null,
    hooks: {
      beforeAll: [],
      afterAll: [],
      beforeEach: [],
      afterEach: [],
    },
  };
  private currentDescribe: IDescribeNode = this.root;

  describe(description: string, fn: () => void): void {
    const describeNode: IDescribeNode = {
      type: 'describe',
      description,
      fn,
      children: [],
      parent: this.currentDescribe,
      hooks: {
        beforeAll: [],
        afterAll: [],
        beforeEach: [],
        afterEach: [],
      },
    };

    this.currentDescribe.children.push(describeNode);
    const previousDescribe = this.currentDescribe;
    this.currentDescribe = describeNode;

    fn();

    this.currentDescribe = previousDescribe;

    return this.mocks.describe(description, fn);
  }

  it(description: string, fn: IExternalTestCallback, timeout?: number): void {
    const itNode: IItNode = {
      type: 'it',
      description,
      fn,
      parent: this.currentDescribe,
    };
    this.currentDescribe.children.push(itNode);

    return this.mocks.it(description, fn, timeout);
  }

  beforeAll(fn: () => void | Promise<void>): void {
    this.currentDescribe.hooks.beforeAll.push(fn);
    return this.mocks.beforeAll(fn);
  }

  afterAll(fn: () => void | Promise<void>): void {
    this.currentDescribe.hooks.afterAll.push(fn);
    return this.mocks.afterAll(fn);
  }

  beforeEach(fn: () => void | Promise<void>): void {
    this.currentDescribe.hooks.beforeEach.push(fn);
    return this.mocks.beforeEach(fn);
  }

  afterEach(fn: () => void | Promise<void>): void {
    this.currentDescribe.hooks.afterEach.push(fn);
    return this.mocks.afterEach(fn);
  }

  async execute(): Promise<void> {
    await this.executeNode(this.root);
  }

  private collectHooks(node: IItNode): {
    beforeEach: Array<() => void | Promise<void>>;
    afterEach: Array<() => void | Promise<void>>;
  } {
    const hooks = {
      beforeEach: [] as Array<() => void | Promise<void>>,
      afterEach: [] as Array<() => void | Promise<void>>,
    };

    let current: IDescribeNode | null = node.parent;
    while (current) {
      hooks.beforeEach.unshift(...current.hooks.beforeEach);
      hooks.afterEach.push(...current.hooks.afterEach);
      current = current.parent;
    }

    return hooks;
  }

  private async executeNode(node: IExecutionNode): Promise<void> {
    if (node.type === 'describe') {
      // Execute beforeAll hooks
      for (const hook of node.hooks.beforeAll) {
        await hook();
      }

      // Execute all test cases
      const tests = node.children.filter((child): child is IItNode => child.type === 'it');
      for (const test of tests) {
        const { beforeEach, afterEach } = this.collectHooks(test);

        // Execute beforeEach hooks
        for (const hook of beforeEach) {
          await hook();
        }

        // Execute test
        await test.fn();

        // Execute afterEach hooks
        for (const hook of afterEach) {
          await hook();
        }
      }

      // Execute nested describes
      const describes = node.children.filter((child): child is IDescribeNode => child.type === 'describe');
      for (const describe of describes) {
        await this.executeNode(describe);
      }

      // Execute afterAll hooks
      for (const hook of node.hooks.afterAll) {
        await hook();
      }
    }
  }
}
