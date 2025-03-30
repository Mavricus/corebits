export class BaseError extends Error {
    context;
    constructor(message, context, originalError) {
        super(message);
        this.context = context;
        this.buildStack(originalError);
    }
    getErrorStack(error) {
        if (!error) {
            return [];
        }
        if (error instanceof Error) {
            return error.stack?.split('\n') ?? [`${error.name}: ${error.message}]`];
        }
        if (typeof error === 'string') {
            return [error];
        }
        if (error?.name != null || error.message != null) {
            return [[error.name, error.message].join(': ')];
        }
        return [];
    }
    buildStack(originalError) {
        const stack = this.stack?.split('\n') ?? [];
        stack[0] = `${this.constructor.name}: ${this.message}`;
        const originalErrorStack = this.getErrorStack(originalError);
        if (originalErrorStack.length) {
            originalErrorStack[0] = `Caused by: ${originalErrorStack[0]}`;
            stack.push(...originalErrorStack);
        }
        this.stack = stack.join('\n');
    }
}
