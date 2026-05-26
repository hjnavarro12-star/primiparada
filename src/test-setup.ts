import { vi } from 'vitest';

// Inicializa el entorno de testing de Angular para TestBed
import '@angular/compiler';
import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

// Sustituye Ionic standalone por componentes Angular livianos durante Vitest.
vi.mock('@ionic/angular/standalone', async () => import('./testing/ionic-standalone.mock'));

// Mockea Capacitor App para evitar llamadas nativas en tests
vi.mock('@capacitor/app', async () => ({
  App: {
    exitApp: vi.fn().mockResolvedValue(undefined),
    addListener: vi.fn(async () => ({ remove: vi.fn().mockResolvedValue(undefined) })),
    getInfo: vi.fn().mockResolvedValue({ build: '1', version: '1.0.0' })
  }
}));

TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
