import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { V17Auditorium2Page } from './v17-auditorium2-page';

describe('V17Auditorium2Page', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V17Auditorium2Page],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('renders auditorium 2 placeholder', () => {
    const fixture = TestBed.createComponent(V17Auditorium2Page);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Auditorio 2');
  });
});
