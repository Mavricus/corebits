import { BaseError, IBaseErrorContext } from '@flex-platform/base-error';

export interface ISetValueErrorContext extends IBaseErrorContext {
  key: string;
  ttl?: number;
}

export class KvsSetValueError extends BaseError<ISetValueErrorContext> {
  constructor(message: string, key: string, ttl?: number, originalError?: Error) {
    super(message, { key, ttl }, originalError);
  }
}
