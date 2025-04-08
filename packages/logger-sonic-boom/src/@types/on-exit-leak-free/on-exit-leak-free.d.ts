declare module 'on-exit-leak-free' {
  export function register<T>(obj: T, fn: (self: T, event: 'exit' | 'beforeExit') => void): void;

  export function registerBeforeExit<T>(obj: T, fn: (self: T, event: 'exit' | 'beforeExit') => void): void;

  export function unregister<T>(obj: T): void;
}
