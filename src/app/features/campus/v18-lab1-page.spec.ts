import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { V18Lab1Page } from './v18-lab1-page';

describe('V18Lab1Page', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V18Lab1Page],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('renders lab1 placeholder', () => {
    const fixture = TestBed.createComponent(V18Lab1Page);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Laboratorio 1');
  });
});
