export class MiddlewareManager {
    action;
    middlewares = [];
    constructor(action) {
        this.action = action;
    }
    add(middleware) {
        this.middlewares.push(middleware);
        return this;
    }
    execute(...data) {
        return this.middlewares.reduceRight((next, middleware) => ((...scope) => middleware(next, ...scope)), this.action)(...data);
    }
}
