import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const ALLOWED_DOMAINS = [
  'unipacifico.edu.co',
  'gmail.com',
  'hotmail.com',
  'outlook.com',
  'outlook.es'
];

export function allowedEmailDomainValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const email = control.value as string;
    if (!email || !email.includes('@')) return null;

    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) return null;

    if (ALLOWED_DOMAINS.includes(domain)) {
      return null;
    }

    return { invalidDomain: { actualDomain: domain, allowedDomains: ALLOWED_DOMAINS } };
  };
}
