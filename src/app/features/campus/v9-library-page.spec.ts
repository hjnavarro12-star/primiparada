import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { V9LibraryPage } from './v9-library-page';

describe('V9LibraryPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V9LibraryPage],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('renders library placeholder and navigation', () => {
    const fixture = TestBed.createComponent(V9LibraryPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Biblioteca');
    expect(fixture.nativeElement.querySelector('.placeholder')).toBeTruthy();
  });
});
