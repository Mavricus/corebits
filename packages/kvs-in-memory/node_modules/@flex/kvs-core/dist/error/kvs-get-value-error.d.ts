import { BaseError, IBaseErrorContext } from '@flex/base-error';
export interface IGetValueErrorContext extends IBaseErrorContext {
    key: string;
}
export declare class KvsGetValueError extends BaseError<IGetValueErrorContext> {
    constructor(message: string, key: string, originalError?: Error);
}
//# sourceMappingURL=kvs-get-value-error.d.ts.map