import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { V10CafeteriaPage } from './v10-cafeteria-page';

describe('V10CafeteriaPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V10CafeteriaPage],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('renders cafeteria placeholder', () => {
    const fixture = TestBed.createComponent(V10CafeteriaPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Cafetería');
    expect(fixture.nativeElement.querySelector('.placeholder')).toBeTruthy();
  });
});
