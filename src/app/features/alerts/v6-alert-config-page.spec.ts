import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { StorageService } from '../../core/services/storage.service';
import { V6AlertConfigPage } from './v6-alert-config-page';

describe('V6AlertConfigPage', () => {
  const storageMock = {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn()
  };

  beforeEach(async () => {
    storageMock.get.mockResolvedValue(JSON.stringify({ minutes: 20, email: true }));
    storageMock.set.mockResolvedValue(undefined);
    storageMock.remove.mockResolvedValue(undefined);

    await TestBed.configureTestingModule({
      imports: [V6AlertConfigPage],
      providers: [provideRouter([]), { provide: StorageService, useValue: storageMock }]
    }).compileComponents();
  });

  it('reads initial values from preferences', async () => {
    const fixture = TestBed.createComponent(V6AlertConfigPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.minutes()).toBe(20);
    expect(fixture.componentInstance.email()).toBe(true);
  });

  it('saves changed values to preferences', async () => {
    const fixture = TestBed.createComponent(V6AlertConfigPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    fixture.componentInstance.setMinutes({ target: { value: '30' } } as unknown as Event);
    fixture.componentInstance.toggleEmail({ target: { checked: false } } as unknown as Event);
    fixture.componentInstance.save();

    const raw = storageMock.set.mock.calls[storageMock.set.mock.calls.length - 1][1];
    const parsed = JSON.parse(raw);
    expect(parsed.minutes).toBe(30);
    expect(parsed.email).toBe(false);
  });
});
