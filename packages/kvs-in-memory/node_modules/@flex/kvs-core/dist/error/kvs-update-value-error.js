import { BaseError } from '@flex/base-error';
export class KvsUpdateValueError extends BaseError {
    constructor(message, key, ttl, originalError) {
        super(message, { key, ttl }, originalError);
    }
}
