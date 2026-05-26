import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { V19Lab2Page } from './v19-lab2-page';

describe('V19Lab2Page', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V19Lab2Page],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('renders lab2 placeholder', () => {
    const fixture = TestBed.createComponent(V19Lab2Page);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Laboratorio 2');
  });
});
