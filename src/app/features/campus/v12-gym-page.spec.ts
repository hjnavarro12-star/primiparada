import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { V12GymPage } from './v12-gym-page';

describe('V12GymPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V12GymPage],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('renders gym placeholder', () => {
    const fixture = TestBed.createComponent(V12GymPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Gimnasio');
    expect(fixture.nativeElement.querySelector('.placeholder')).toBeTruthy();
  });
});
