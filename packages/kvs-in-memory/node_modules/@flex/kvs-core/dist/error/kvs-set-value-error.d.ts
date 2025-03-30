import { BaseError, IBaseErrorContext } from '@flex/base-error';
export interface ISetValueErrorContext extends IBaseErrorContext {
    key: string;
    ttl?: number;
}
export declare class KvsSetValueError extends BaseError<ISetValueErrorContext> {
    constructor(message: string, key: string, ttl?: number, originalError?: Error);
}
//# sourceMappingURL=kvs-set-value-error.d.ts.map