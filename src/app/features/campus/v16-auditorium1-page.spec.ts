import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { V16Auditorium1Page } from './v16-auditorium1-page';

describe('V16Auditorium1Page', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V16Auditorium1Page],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('renders auditorium 1 placeholder', () => {
    const fixture = TestBed.createComponent(V16Auditorium1Page);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Auditorio 1');
  });
});
