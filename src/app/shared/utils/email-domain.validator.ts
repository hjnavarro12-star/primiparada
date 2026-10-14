import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Dominios de correo aceptados.
 * Incluye: dominios institucionales universitarios colombianos,
 * proveedores globales legítimos más usados, y correos corporativos
 * conocidos. Se rechazan dominios desechables o temporales.
 */
export const ALLOWED_DOMAINS: ReadonlySet<string> = new Set([
  // ── Institucional UnPa ────────────────────────────────────────
  'unipacifico.edu.co',

  // ── Universidades colombianas (.edu.co) ───────────────────────
  'unal.edu.co',
  'uniandes.edu.co',
  'javeriana.edu.co',
  'udea.edu.co',
  'uis.edu.co',
  'univalle.edu.co',
  'unicolmayor.edu.co',
  'unimilitar.edu.co',
  'pedagogica.edu.co',
  'unipamplona.edu.co',
  'unicauca.edu.co',
  'uniquindio.edu.co',
  'ucaldas.edu.co',
  'unisucre.edu.co',
  'unicordoba.edu.co',
  'unillanos.edu.co',
  'ufps.edu.co',
  'uniguajira.edu.co',
  'utch.edu.co',
  'unad.edu.co',
  'cun.edu.co',
  'sena.edu.co',

  // ── Correos corporativos / profesionales ──────────────────────
  'edu.co',       // dominio comodín: cualquier .edu.co se valida abajo

  // ── Google / Alphabet ─────────────────────────────────────────
  'gmail.com',
  'googlemail.com',

  // ── Microsoft ─────────────────────────────────────────────────
  'outlook.com',
  'outlook.es',
  'outlook.com.co',
  'hotmail.com',
  'hotmail.es',
  'hotmail.com.co',
  'live.com',
  'live.com.co',
  'live.es',
  'msn.com',

  // ── Apple ─────────────────────────────────────────────────────
  'icloud.com',
  'me.com',
  'mac.com',

  // ── Yahoo ─────────────────────────────────────────────────────
  'yahoo.com',
  'yahoo.es',
  'yahoo.com.co',
  'ymail.com',

  // ── Otros proveedores globales reconocidos ────────────────────
  'proton.me',
  'protonmail.com',
  'pm.me',
  'zoho.com',
  'zohomail.com',
  'tutanota.com',
  'fastmail.com',
  'fastmail.fm',
  'hey.com',
  'icloud.com',
]);

/**
 * Validador de dominio de correo.
 * Acepta:
 *   - Dominios en la lista ALLOWED_DOMAINS
 *   - Cualquier dominio que termine en .edu.co (institucional colombiano)
 *   - Cualquier dominio que termine en .edu (internacional)
 * Rechaza cualquier otro dominio.
 */
export function allowedEmailDomainValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const email = control.value as string;
    if (!email || !email.includes('@')) return null;

    const domain = email.split('@')[1]?.toLowerCase().trim();
    if (!domain) return null;

    // Dominios institucionales de educación (.edu.co, .edu)
    if (domain.endsWith('.edu.co') || domain.endsWith('.edu')) return null;

    // Lista explícita de dominios permitidos
    if (ALLOWED_DOMAINS.has(domain)) return null;

    return {
      invalidDomain: {
        actualDomain: domain,
        message: 'Usa un correo institucional (.edu.co) o un proveedor conocido (Gmail, Outlook, iCloud, etc.)'
      }
    };
  };
}
