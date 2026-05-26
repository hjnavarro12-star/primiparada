import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ScheduleService } from '../../../core/services/schedule.service';

import { V5AlertsPage } from './v5-alerts-page';

describe('V5AlertsPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V5AlertsPage],
      providers: [provideRouter([]), ScheduleService]
    }).compileComponents();
  });

  it('renders next class and list', () => {
    const fixture = TestBed.createComponent(V5AlertsPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Próxima clase');
    expect(fixture.nativeElement.querySelectorAll('ul li').length).toBeGreaterThanOrEqual(1);
  });
});
