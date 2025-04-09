import { BaseError } from '../../src/index.js';

class TestError extends BaseError<{ test: string }> {
  constructor(message: string, context: { test: string }, originalError?: Error) {
    super(message, context, originalError);
  }
}

describe('BaseError', () => {
  describe('constructor', () => {
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

  describe('causedBy', () => {
    it('should provide access to the original error', () => {
      const originalError = new Error('Original error');
      const error = new TestError('Test', { test: 'test' }, originalError);

      expect(error.causedBy).toBe(originalError);
    });

    it('should include the original error in the stack', () => {
      const originalError = new Error('Original error');
      const error = new TestError('Test', { test: 'test' }, originalError);

      expect(error.stack).toContain('Caused by: Error: Original error');
    });

    it('should allow for a custom error as the original error', () => {
      const originalError = new TestError('Original error', { test: 'original' });
      const error = new TestError('Test', { test: 'test' }, originalError);

      expect(error.stack).toContain('Caused by: TestError: Original error');
    });

    it('should not include the original error if not provided', () => {
      const error = new TestError('Test', { test: 'test' });

      expect(error.stack).not.toContain('Caused by:');
    });

    it('should not include the original error if null', () => {
      const error = new TestError('Test', { test: 'test' }, null as unknown as Error);

      expect(error.stack).not.toContain('Caused by:');
    });

    it('should not include the original error if undefined', () => {
      const error = new TestError('Test', { test: 'test' }, undefined);

      expect(error.stack).not.toContain('Caused by:');
    });

    it('should allow custom error to be a string', () => {
      const error = new TestError('Test', { test: 'test' }, 'Original error' as unknown as Error);

      expect(error.stack).toContain('Caused by: Original error');
    });

    it('should allow custom error to be an object', () => {
      const error = new TestError('Test', { test: 'test' }, {
        name: 'CustomError',
        message: 'Custom error',
      } as unknown as Error);

      expect(error.stack).toContain('Caused by: CustomError: Custom error');
    });

    it('should allow custom error to be an object with no message', () => {
      const error = new TestError('Test', { test: 'test' }, { name: 'CustomError' } as unknown as Error);
      expect(error.stack).toContain('Caused by: CustomError');
    });

    it('should allow custom error to be an object with no name', () => {
      const error = new TestError('Test', { test: 'test' }, { message: 'Custom error' } as unknown as Error);
      expect(error.stack).toContain('Caused by: Custom error');
    });

    it('should allow custom error to be an object with no name or message', () => {
      const error = new TestError('Test', { test: 'test' }, {} as unknown as Error);
      expect(error.stack).not.toContain('Caused by');
    });

    it('should allow custom error to be an object with stack', () => {
      const error = new TestError('Test', { test: 'test' }, { stack: 'CustomErrorStack' } as unknown as Error);
      expect(error.stack).toContain('Caused by: CustomErrorStack');
    });
  });
});
