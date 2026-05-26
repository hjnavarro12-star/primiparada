import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly memory = new Map<string, string>();

  async get(key: string): Promise<string | null> {
    try {
      const { Preferences } = await import('@capacitor/preferences');
      const res = await Preferences.get({ key });
      return res && typeof res.value === 'string' ? res.value : null;
    } catch {
      return this.memory.has(key) ? this.memory.get(key)! : null;
    }
  }

  async set(key: string, value: string): Promise<void> {
    try {
      const { Preferences } = await import('@capacitor/preferences');
      await Preferences.set({ key, value });
    } catch {
      this.memory.set(key, value);
    }
  }

  async remove(key: string): Promise<void> {
    try {
      const { Preferences } = await import('@capacitor/preferences');
      await Preferences.remove({ key });
    } catch {
      this.memory.delete(key);
    }
  }
}
