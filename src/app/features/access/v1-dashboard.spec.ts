import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { V1Dashboard } from './v1-dashboard';

describe('V1Dashboard', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V1Dashboard],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('renders welcome and action links', () => {
    const fixture = TestBed.createComponent(V1Dashboard);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Bienvenidos');
    expect(fixture.nativeElement.textContent).toContain('Iniciar sesión');
    expect(fixture.nativeElement.textContent).toContain('Registrarse');
  });
});
