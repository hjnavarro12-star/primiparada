import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { V20GreenhousePage } from './v20-greenhouse-page';

describe('V20GreenhousePage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V20GreenhousePage],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('renders greenhouse placeholder', () => {
    const fixture = TestBed.createComponent(V20GreenhousePage);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Invernaderos');
  });
});
