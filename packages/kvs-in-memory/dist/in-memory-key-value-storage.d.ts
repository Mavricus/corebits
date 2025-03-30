import { IKeyValueStorage } from '@flex/kvs-core';
export declare class InMemoryKeyValueStorage<T> implements IKeyValueStorage<T> {
    private readonly storage;
    get(key: string): Promise<T | null>;
    set(key: string, value: T, ttlSec?: number): Promise<void>;
    delete(key: string): Promise<void>;
    update(key: string, value: T, ttlSec?: number): Promise<void>;
    updateValue(key: string, value: T): Promise<void>;
    updateTtl(key: string, ttlSec?: number): Promise<void>;
    setOrUpdate(key: string, value: T, ttlSec?: number): Promise<void>;
    private cleanTimer;
    private setTtl;
}
//# sourceMappingURL=in-memory-key-value-storage.d.ts.map