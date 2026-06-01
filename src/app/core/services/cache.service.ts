import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

interface CacheEntry {
  value: unknown;
  expiry: number;
}

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private cache = new Map<string, CacheEntry>();

  get(key: string): unknown | null {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  set(key: string, value: unknown, ttl: number = environment.cacheTtl): void {
    this.cache.set(key, {
      value,
      expiry: Date.now() + ttl,
    });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}
