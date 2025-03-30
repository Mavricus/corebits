import { BaseError } from '@flex/base-error';
export class KvsGetValueError extends BaseError {
    constructor(message, key, originalError) {
        super(message, { key }, originalError);
    }
}
