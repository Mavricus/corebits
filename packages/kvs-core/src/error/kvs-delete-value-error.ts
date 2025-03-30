import { BaseError, IBaseErrorContext } from '@flex-platform/base-error';

export interface IDeleteValueErrorContext extends IBaseErrorContext {
  key: string;
}

export class KvsDeleteValueError extends BaseError<IDeleteValueErrorContext> {
  constructor(message: string, key: string, originalError?: Error) {
    super(message, { key }, originalError);
  }
}
