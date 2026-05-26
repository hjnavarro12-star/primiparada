import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { V7CampusDirectoryPage } from './v7-campus-directory-page';

describe('V7CampusDirectoryPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V7CampusDirectoryPage],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('renders campus directory cards', () => {
    const fixture = TestBed.createComponent(V7CampusDirectoryPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Directorio de Lugares');
    expect(fixture.nativeElement.querySelectorAll('a.card').length).toBeGreaterThan(5);
  });
});
