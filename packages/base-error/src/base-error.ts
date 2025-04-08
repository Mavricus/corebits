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
  private readonly mark: string = BASE_ERROR_MARK;

  protected constructor(message: string, context: DeepReadonly<T>, originalError?: Error) {
    super(message);
    this.context = context;

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

    if ((error as Error)?.name != null || (error as Error).message != null) {
      return [[(error as Error).name, (error as Error).message].join(': ')];
    }

    return [];
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
