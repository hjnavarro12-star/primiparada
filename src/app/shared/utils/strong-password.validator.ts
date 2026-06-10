import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function strongPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.value as string;
    if (!password) return null;

    const errors: string[] = [];

    if (password.length < 8) errors.push('Mínimo 8 caracteres');
    if (!/[A-Z]/.test(password)) errors.push('Una mayúscula');
    if (!/[a-z]/.test(password)) errors.push('Una minúscula');
    if (!/[0-9]/.test(password)) errors.push('Un número');
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) errors.push('Un carácter especial');

    if (errors.length === 0) return null;

    return { weakPassword: { requirements: errors } };
  };
}
