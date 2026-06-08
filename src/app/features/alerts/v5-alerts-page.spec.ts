import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { ScheduleService } from '../../core/services/schedule.service';
import { StorageService } from '../../core/services/storage.service';
import { ScheduleSyncService } from '../../core/services/schedule-sync.service';

import { V5AlertsPage } from './v5-alerts-page';

describe('V5AlertsPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V5AlertsPage],
      providers: [
        provideRouter([]),
        { provide: StorageService, useValue: { get: async () => null, set: async () => void 0, remove: async () => void 0 } },
        { provide: ScheduleSyncService, useValue: { queueScheduleChanges: vi.fn().mockResolvedValue(void 0) } },
        ScheduleService
      ]
    }).compileComponents();
  });

  it('renders next class and list', () => {
    const fixture = TestBed.createComponent(V5AlertsPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Próxima clase');
  });
});
