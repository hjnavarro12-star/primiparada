import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { V11TrailPage } from './v11-trail-page';

describe('V11TrailPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V11TrailPage],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('renders trail placeholder', () => {
    const fixture = TestBed.createComponent(V11TrailPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Sendero Turístico');
    expect(fixture.nativeElement.querySelector('.placeholder')).toBeTruthy();
  });
});
