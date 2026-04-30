import { Injectable } from '@angular/core';

import type { Program } from '../../shared/models/program.model';
import { SupabaseClientService } from './supabase-client.service';

export const FALLBACK_PROGRAMS: Program[] = [
  { id: 'local-1', code: 'ISW', name: 'Ingeniería de Sistemas', faculty: 'Ingeniería' },
  { id: 'local-2', code: 'ADM', name: 'Administración de Empresas', faculty: 'Ciencias Económicas' },
  { id: 'local-3', code: 'CON', name: 'Contaduría Pública', faculty: 'Ciencias Económicas' },
  { id: 'local-4', code: 'DER', name: 'Derecho', faculty: 'Ciencias Jurídicas' }
];

@Injectable({ providedIn: 'root' })
export class ProgramsService {
  constructor(private readonly supabaseClientService: SupabaseClientService) {}

  async listPrograms(): Promise<Program[]> {
    try {
      const { data, error } = await this.supabaseClientService.client
        .from('programs')
        .select('id, name, code, faculty')
        .order('name', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      const programs = (data ?? []) as Program[];

      if (programs.length === 0) {
        return FALLBACK_PROGRAMS;
      }

      return programs;
    } catch {
      return FALLBACK_PROGRAMS;
    }
  }
}
