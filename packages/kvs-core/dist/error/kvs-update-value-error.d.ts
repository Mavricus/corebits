import { BaseError, IBaseErrorContext } from '@flex/base-error';
export interface IUpdateValueErrorContext extends IBaseErrorContext {
    key: string;
    ttl?: number;
}
export declare class KvsUpdateValueError extends BaseError<IUpdateValueErrorContext> {
    constructor(message: string, key: string, ttl?: number, originalError?: Error);
}
//# sourceMappingURL=kvs-update-value-error.d.ts.map