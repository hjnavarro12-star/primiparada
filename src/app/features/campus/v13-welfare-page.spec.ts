import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { V13WelfarePage } from './v13-welfare-page';

describe('V13WelfarePage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V13WelfarePage],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('renders welfare placeholder', () => {
    const fixture = TestBed.createComponent(V13WelfarePage);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Bienestar Universitario');
  });
});
