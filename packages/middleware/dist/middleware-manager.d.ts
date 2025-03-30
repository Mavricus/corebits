export interface IMiddleware<T extends (...args: P) => R, P extends Array<unknown> = Parameters<T>, R = ReturnType<T>> {
    (next: T, ...data: Parameters<T>): ReturnType<T>;
}
export interface IMiddlewareManager<T extends (...args: P) => R, P extends Array<unknown> = Parameters<T>, R = ReturnType<T>> {
    add(middleware: IMiddleware<T, P, R>): this;
    execute(...data: P): R;
}
export declare class MiddlewareManager<T extends (...args: P) => R, P extends Array<unknown> = Parameters<T>, R = ReturnType<T>> implements IMiddlewareManager<T, P, R> {
    private readonly action;
    private readonly middlewares;
    constructor(action: T);
    add(middleware: IMiddleware<T, P, R>): this;
    execute(...data: Parameters<T>): ReturnType<T>;
}
//# sourceMappingURL=middleware-manager.d.ts.map