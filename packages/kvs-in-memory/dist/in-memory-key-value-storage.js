import { KvsSetValueError, KvsUpdateValueError } from '@flex/kvs-core';
export class InMemoryKeyValueStorage {
    storage = new Map();
    get(key) {
        const value = this.storage.get(key);
        if (value == null) {
            return Promise.resolve(null);
        }
        return Promise.resolve(value.value);
    }
    set(key, value, ttlSec) {
        if (this.storage.has(key)) {
            return Promise.reject(new KvsSetValueError('The key is already defined', key, ttlSec));
        }
        this.storage.set(key, { value, timer: this.setTtl(key, ttlSec) });
        return Promise.resolve();
    }
    delete(key) {
        const item = this.storage.get(key);
        if (item == null) {
            return Promise.resolve();
        }
        this.cleanTimer(item);
        this.storage.delete(key);
        return Promise.resolve();
    }
    update(key, value, ttlSec) {
        const item = this.storage.get(key);
        if (item == null) {
            return Promise.reject(new KvsUpdateValueError('Key is not defined', key, ttlSec));
        }
        this.storage.set(key, { value, timer: this.setTtl(key, ttlSec) });
        return Promise.resolve();
    }
    updateValue(key, value) {
        const item = this.storage.get(key);
        if (item == null) {
            return Promise.reject(new KvsUpdateValueError('Key is not defined', key));
        }
        item.value = value;
        return Promise.resolve();
    }
    updateTtl(key, ttlSec) {
        const item = this.storage.get(key);
        if (item == null) {
            return Promise.reject(new KvsUpdateValueError('Key is not defined', key, ttlSec));
        }
        this.cleanTimer(item);
        item.timer = this.setTtl(key, ttlSec);
        return Promise.resolve();
    }
    setOrUpdate(key, value, ttlSec) {
        const item = this.storage.get(key);
        if (item != null) {
            this.cleanTimer(item);
        }
        this.storage.set(key, { value, timer: this.setTtl(key, ttlSec) });
        return Promise.resolve();
    }
    cleanTimer(item) {
        if (item.timer != null) {
            clearTimeout(item.timer);
        }
    }
    setTtl(key, ttlSec) {
        if (ttlSec == null) {
            return null;
        }
        return setTimeout(() => this.storage.delete(key), ttlSec * 1000);
    }
}
