export type DeepReadonly<TType> = TType extends (infer SubType)[] ? DeepReadonlyArray<SubType> : TType extends (...args: any[]) => any ? TType : TType extends object ? DeepReadonlyObject<TType> : TType;
export type DeepReadonlyArray<TType> = ReadonlyArray<DeepReadonly<TType>>;
export type DeepReadonlyObject<TType> = {
    readonly [TKey in keyof TType]: DeepReadonly<TType[TKey]>;
};
export type IErrorContextField = string | number | Date | boolean | null | undefined;
export interface IBaseErrorContext {
    [key: string]: IErrorContextField | IBaseErrorContext | Array<IErrorContextField | IBaseErrorContext>;
}
export declare abstract class BaseError<T extends IBaseErrorContext> extends Error {
    readonly context: DeepReadonly<T>;
    protected constructor(message: string, context: DeepReadonly<T>, originalError?: Error);
    private getErrorStack;
    private buildStack;
}
//# sourceMappingURL=base-error.d.ts.map