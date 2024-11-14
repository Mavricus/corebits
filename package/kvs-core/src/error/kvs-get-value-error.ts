import { BaseError, IBaseErrorContext } from '@flex/base-error';

export interface IGetValueErrorContext extends IBaseErrorContext {
  key: string;
}

export class KvsGetValueError extends BaseError<IGetValueErrorContext> {
  constructor(message: string, key: string, originalError?: Error) {
    super(message, { key }, originalError);
  }
}
