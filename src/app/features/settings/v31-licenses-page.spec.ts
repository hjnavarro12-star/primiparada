import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { V31LicensesPage } from './v31-licenses-page';

describe('V31LicensesPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V31LicensesPage],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('renders a list of licenses', () => {
    const fixture = TestBed.createComponent(V31LicensesPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Licencias Open Source');
    expect(fixture.nativeElement.querySelectorAll('ol li').length).toBeGreaterThan(0);
  });
});
