import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { V15EntrancePage } from './v15-entrance-page';

describe('V15EntrancePage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V15EntrancePage],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('renders entrance placeholder', () => {
    const fixture = TestBed.createComponent(V15EntrancePage);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Entrada / Salida');
  });
});
