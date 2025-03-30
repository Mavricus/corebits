export interface IMiddleware<T extends (...args: P) => R, P extends Array<unknown> = Parameters<T>, R = ReturnType<T>> {
  (next: T, ...data: Parameters<T>): ReturnType<T>;
}

export interface IMiddlewareManager<
  T extends (...args: P) => R,
  P extends Array<unknown> = Parameters<T>,
  R = ReturnType<T>,
> {
  add(middleware: IMiddleware<T, P, R>): this;

  execute(...data: P): R;
}

export class MiddlewareManager<T extends (...args: P) => R, P extends Array<unknown> = Parameters<T>, R = ReturnType<T>>
  implements IMiddlewareManager<T, P, R>
{
  private readonly middlewares: Array<IMiddleware<T, P, R>> = [];

  constructor(private readonly action: T) {}

  add(middleware: IMiddleware<T, P, R>): this {
    this.middlewares.push(middleware);
    return this;
  }

  execute(...data: Parameters<T>): ReturnType<T> {
    return this.middlewares.reduceRight(
      (next: T, middleware: IMiddleware<T, P, R>) => ((...scope: Parameters<T>) => middleware(next, ...scope)) as T,
      this.action,
    )(...data) as ReturnType<T>;
  }
}
