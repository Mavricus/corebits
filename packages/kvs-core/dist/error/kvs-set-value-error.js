import { BaseError } from '@flex/base-error';
export class KvsSetValueError extends BaseError {
    constructor(message, key, ttl, originalError) {
        super(message, { key, ttl }, originalError);
    }
}
