import { BaseError } from '../../src/index.js';

class TestError extends BaseError<{ test: string }> {
  constructor(message: string, context: { test: string }, originalError?: Error) {
    super(message, context, originalError);
  }
}

describe('BaseError', () => {
  it('should be an instance of Error', () => {
    expect(new TestError('Test', { test: 'test' })).toBeInstanceOf(Error);
  });

  it('should have the correct message', () => {
    expect(new TestError('Test', { test: 'test' }).message).toBe('Test');
  });

  it('should have the correct context', () => {
    expect(new TestError('Test', { test: 'test' }).context).toEqual({ test: 'test' });
  });

  it('should have the correct stack', () => {
    expect(new TestError('Test', { test: 'test' }).stack).toBeDefined();
  });

  it('should include the original error in the stack', () => {
    const originalError = new Error('Original error');
    const error = new TestError('Test', { test: 'test' }, originalError);
    expect(error.stack).toContain('Original error');
  });

  it('should include the original error in the stack', () => {
    const originalError = new Error('Original error');
    const error = new TestError('Test', { test: 'test' }, originalError);
    expect(error.stack).toContain('Original error');
  });

  describe('isCorebitsError', () => {
    it('should return true for BaseError instance', () => {
      const error = new TestError('Test', { test: 'test' });
      expect(BaseError.isCorebitsError(error)).toBe(true);
    });

    it('should return false for non-BaseError instance', () => {
      const error = new Error('Test');
      expect(BaseError.isCorebitsError(error)).toBe(false);
    });

    it('should return false for null', () => {
      expect(BaseError.isCorebitsError(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(BaseError.isCorebitsError(undefined)).toBe(false);
    });
  });
});
