import { BaseError, IBaseErrorContext } from '@flex/base-error';
export interface IDeleteValueErrorContext extends IBaseErrorContext {
    key: string;
}
export declare class KvsDeleteValueError extends BaseError<IDeleteValueErrorContext> {
    constructor(message: string, key: string, originalError?: Error);
}
//# sourceMappingURL=kvs-delete-value-error.d.ts.map