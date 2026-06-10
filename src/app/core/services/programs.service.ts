import { Injectable, inject } from '@angular/core';

import type { Program } from '../../shared/models/program.model';
import { SupabaseClientService } from './supabase-client.service';

/** Catálogo local de programas académicos de la Universidad del Pacífico */
const LOCAL_PROGRAMS: Program[] = [
  { id: 'prog-01', code: 'IS', name: 'Ingeniería de Sistemas', faculty: 'Ingeniería' },
  { id: 'prog-02', code: 'AGR', name: 'Agronomía', faculty: 'Ciencias Naturales' },
  { id: 'prog-03', code: 'TAC', name: 'Tecnología en Acuicultura', faculty: 'Ciencias Naturales' },
  { id: 'prog-04', code: 'TCC', name: 'Tecnología en Construcciones Civiles', faculty: 'Ingeniería' },
  { id: 'prog-05', code: 'TGHT', name: 'Tecnología en Gestión Hotelera y Turística', faculty: 'Ciencias Económicas' },
  { id: 'prog-06', code: 'ANI', name: 'Administración de Negocios Internacionales', faculty: 'Ciencias Económicas' },
  { id: 'prog-07', code: 'ARQ', name: 'Arquitectura', faculty: 'Ingeniería' },
  { id: 'prog-08', code: 'SOC', name: 'Sociología', faculty: 'Humanidades' },
  { id: 'prog-09', code: 'TUR', name: 'Turismo', faculty: 'Ciencias Económicas' },
  { id: 'prog-10', code: 'TPP', name: 'Tecnología en Producción Piscícola', faculty: 'Ciencias Naturales' }
];

@Injectable({ providedIn: 'root' })
export class ProgramsService {
  private readonly supabaseClient = inject(SupabaseClientService);

  /**
   * Carga los programas académicos. Intenta desde Supabase primero,
   * si falla usa el catálogo local hardcoded.
   */
  async listPrograms(): Promise<Program[]> {
    try {
      const { data, error } = await this.supabaseClient.client
        .from('programs')
        .select('id, name, code, faculty')
        .order('name');

      if (error || !data || data.length === 0) {
        return LOCAL_PROGRAMS;
      }

      return data as Program[];
    } catch {
      return LOCAL_PROGRAMS;
    }
  }
}
