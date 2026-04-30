import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { ProgramsService } from '../../core/services/programs.service';
import { RegistrationService } from '../../core/services/registration.service';
import { RegisterPage } from './register-page';

describe('RegisterPage', () => {
  const programsService = {
    listPrograms: vi.fn(async () => [
      { id: '1', code: 'ISW', name: 'Ingeniería de Sistemas', faculty: 'Ingeniería' },
      { id: '2', code: 'ADM', name: 'Administración de Empresas', faculty: 'Ciencias Económicas' }
    ])
  };

  const registrationService = {
    register: vi.fn(async () => undefined)
  };

  beforeEach(async () => {
    TestBed.overrideComponent(RegisterPage, {
      set: {
        template: '<section class="test-shell"></section>',
        styles: []
      }
    });

    programsService.listPrograms.mockClear();
    registrationService.register.mockClear();

    await TestBed.configureTestingModule({
      imports: [RegisterPage],
      providers: [
        { provide: ProgramsService, useValue: programsService },
        { provide: RegistrationService, useValue: registrationService }
      ]
    }).compileComponents();
  });

  it('loads programs and renders them in the selector', async () => {
    const fixture = TestBed.createComponent(RegisterPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(programsService.listPrograms).toHaveBeenCalledTimes(1);
    expect(fixture.componentInstance.programs()).toHaveLength(2);
    expect(fixture.componentInstance.programs()[0].name).toBe('Ingeniería de Sistemas');
  });

  it('submits valid data and shows success feedback', async () => {
    const fixture = TestBed.createComponent(RegisterPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    fixture.componentInstance.registerForm.setValue({
      email: 'persona@unpa.edu.co',
      password: '12345678',
      programId: '1'
    });

    await fixture.componentInstance.submit();

    expect(registrationService.register).toHaveBeenCalledWith({
      email: 'persona@unpa.edu.co',
      password: '12345678',
      programId: '1'
    });
    expect(fixture.componentInstance.successMessage()).toContain('Registro completado');
  });

  it('shows validation feedback for empty form submission', async () => {
    const fixture = TestBed.createComponent(RegisterPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    await fixture.componentInstance.submit();
    fixture.detectChanges();

    expect(fixture.componentInstance.errorMessage()).toContain('Completa el correo');
  });
});
