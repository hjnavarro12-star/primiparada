import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { AlertController } from '@ionic/angular/standalone';
import { App as CapacitorApp } from '@capacitor/app';

import { AuthService } from './core/services/auth.service';
import { App } from './app';
import { VIEW_GROUPS, VIEW_SPECS } from './view-catalog';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        {
          provide: AlertController,
          useValue: {
            create: async () => ({
              present: async () => void 0,
              onDidDismiss: async () => ({ role: 'cancel' })
            })
          }
        },
        {
          provide: AuthService,
          useValue: {
            signOut: vi.fn().mockResolvedValue(undefined),
            isSignedIn: () => false,
            status: () => 'signed-out'
          }
        }
      ]
    })
      .overrideComponent(App, {
        set: {
          template: '<router-outlet />',
          imports: [],
          styles: []
        }
      })
      .compileComponents();
  });

  it('should instantiate App class and register the native back listener', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
    expect(CapacitorApp.addListener).toHaveBeenCalledWith('backButton', expect.any(Function));
  });

  it('should expose sprint navigation groups and views', () => {
    expect(Array.isArray(VIEW_GROUPS)).toBe(true);
    expect(Array.isArray(VIEW_SPECS)).toBe(true);

    const names = VIEW_GROUPS.map(g => g.title).join(' ');
    expect(names).toContain('Acceso');

    const routePaths = VIEW_SPECS.map(v => v.routePath).join(' ');
    expect(routePaths).toContain('access');
    expect(routePaths).toContain('schedule');
  });
});
