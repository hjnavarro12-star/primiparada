import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { V33RecoveryPage } from './v33-recovery-page';

describe('V33RecoveryPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V33RecoveryPage],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('shows validation feedback when submitted empty', async () => {
    const fixture = TestBed.createComponent(V33RecoveryPage);
    fixture.detectChanges();

    (fixture.componentInstance as { submit(): void }).submit();

    expect(fixture.componentInstance.errorMessage()).toContain('Ingresa un correo institucional válido');
  });

  it('creates a recovery message for a valid email', () => {
    const fixture = TestBed.createComponent(V33RecoveryPage);
    fixture.detectChanges();

    fixture.componentInstance.recoveryForm.setValue({ email: 'estudiante@unpa.edu.ar' });
    (fixture.componentInstance as { submit(): void }).submit();

    expect(fixture.componentInstance.successMessage()).toContain('Se envió un enlace de recuperación');
    expect(fixture.componentInstance.statusMessage()).toContain('estudiante@unpa.edu.ar');
    expect(fixture.componentInstance.recoveryForm.controls.email.value).toBe('');
  });
});