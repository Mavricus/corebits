export type DeepReadonly<TType> = TType extends (infer SubType)[]
  ? DeepReadonlyArray<SubType>
  : TType extends (...args: any[]) => any
    ? TType
    : TType extends object
      ? DeepReadonlyObject<TType>
      : TType;

export type DeepReadonlyArray<TType> = ReadonlyArray<DeepReadonly<TType>>;

export type DeepReadonlyObject<TType> = {
  readonly [TKey in keyof TType]: DeepReadonly<TType[TKey]>;
};

export type IErrorContextField = string | number | Date | boolean | null | undefined;

export interface IBaseErrorContext {
  [key: string]: IErrorContextField | IBaseErrorContext | Array<IErrorContextField | IBaseErrorContext>;
}

const BASE_ERROR_MARK = '4049db3a-aeec-4977-9c9e-f929e49b8d69';

export abstract class BaseError<T extends IBaseErrorContext> extends Error {
  readonly context: DeepReadonly<T>;
  readonly causedBy: Error | undefined;
  private readonly mark: string = BASE_ERROR_MARK;

  protected constructor(message: string, context: DeepReadonly<T>, originalError?: Error) {
    super(message);
    this.context = context;
    this.causedBy = originalError;

    this.buildStack(originalError);
  }

  static isCorebitsError(error: unknown): error is BaseError<IBaseErrorContext> {
    return (error as BaseError<IBaseErrorContext>)?.mark === BASE_ERROR_MARK;
  }

  private getErrorStack(error: unknown): Array<string> {
    if (!error) {
      return [];
    }

    if (error instanceof Error) {
      return error.stack?.split('\n') ?? [`${error.name}: ${error.message}]`];
    }

    if (typeof error === 'string') {
      return [error];
    }

    if (typeof (error as Error)?.stack === 'string') {
      return (error as Error)?.stack?.split('\n') ?? [];
    }

    const result: Array<string> = [];

    if (typeof (error as Error)?.name === 'string') {
      result.push((error as Error).name);
    }

    if (typeof (error as Error)?.message === 'string') {
      result.push((error as Error).message);
    }

    return result.length > 0 ? [result.join(': ')] : [];
  }

  private buildStack(originalError?: Error): void {
    const stack = this.stack?.split('\n') ?? [];

    stack[0] = `${this.constructor.name}: ${this.message}`;
    const originalErrorStack = this.getErrorStack(originalError);

    if (originalErrorStack.length) {
      originalErrorStack[0] = `Caused by: ${originalErrorStack[0]}`;
      stack.push(...originalErrorStack);
    }

    this.stack = stack.join('\n');
  }
}
