import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { V14ParkingPage } from './v14-parking-page';

describe('V14ParkingPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V14ParkingPage],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('renders parking placeholder', () => {
    const fixture = TestBed.createComponent(V14ParkingPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Parqueadero');
  });
});
