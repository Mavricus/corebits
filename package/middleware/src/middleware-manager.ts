export interface IMiddleware<T extends (...args: Array<unknown>) => unknown> {
  (next: T, ...context: Parameters<T>): ReturnType<T>;
}

export interface IMiddlewareManager<T extends (...args: Array<any>) => any> {
  add(middleware: IMiddleware<T>): this;

  execute(...args: Parameters<T>): ReturnType<T>;
}

export class MiddlewareManager<const T extends (...args: Array<unknown>) => unknown> implements IMiddlewareManager<T> {
  private readonly middlewares: Array<IMiddleware<T>> = [];

  constructor(private readonly method: T) {}

  public add(middleware: IMiddleware<T>): this {
    this.middlewares.push(middleware);

    return this;
  }

  public execute(...args: Parameters<T>): ReturnType<T> {
    return this.middlewares.reduceRight(
      (next, middleware) => ((...context: Parameters<T>) => middleware(next, ...context)) as T,
      this.method,
    )(...args) as ReturnType<T>;
  }
}
