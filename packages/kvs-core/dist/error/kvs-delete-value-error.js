import { BaseError } from '@flex/base-error';
export class KvsDeleteValueError extends BaseError {
    constructor(message, key, originalError) {
        super(message, { key }, originalError);
    }
}
