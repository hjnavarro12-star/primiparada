import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { V8BathroomsPage } from './v8-bathrooms-page';

describe('V8BathroomsPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V8BathroomsPage],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('renders bathroom locations and navigation links', () => {
    const fixture = TestBed.createComponent(V8BathroomsPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Baños');
    expect(fixture.nativeElement.querySelectorAll('.card').length).toBe(2);
    expect(fixture.nativeElement.querySelector('a[href="/campus/v7"]')).toBeTruthy();
  });
});
