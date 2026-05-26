import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { StorageService } from '../../core/services/storage.service';
import { V29NotificationsPage } from './v29-notifications-page';

describe('V29NotificationsPage', () => {
  const storageMock = {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn()
  };

  beforeEach(async () => {
    storageMock.get.mockResolvedValue(JSON.stringify({ enabled: true, email: false, push: true }));
    storageMock.set.mockResolvedValue(undefined);
    storageMock.remove.mockResolvedValue(undefined);

    await TestBed.configureTestingModule({
      imports: [V29NotificationsPage],
      providers: [provideRouter([]), { provide: StorageService, useValue: storageMock }]
    }).compileComponents();
  });

  it('renders controls and reads initial preferences', async () => {
    const fixture = TestBed.createComponent(V29NotificationsPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Notificaciones');
    expect(fixture.componentInstance.enabled()).toBe(true);
    expect(fixture.componentInstance.email()).toBe(false);
    expect(fixture.componentInstance.push()).toBe(true);
  });

  it('toggles channels and saves to preferences', async () => {
    const fixture = TestBed.createComponent(V29NotificationsPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    // Toggle email on
    fixture.componentInstance.toggleEmail({ target: { checked: true } } as unknown as Event);
    fixture.detectChanges();
    expect(fixture.componentInstance.email()).toBe(true);

    // Save and verify storage
    await fixture.componentInstance.save();
    fixture.detectChanges();

    expect(storageMock.set).toHaveBeenCalled();
    const lastCall = storageMock.set.mock.calls[storageMock.set.mock.calls.length - 1];
    const raw = lastCall[1];
    const parsed = JSON.parse(raw);
    expect(parsed.email).toBe(true);
  });
});
