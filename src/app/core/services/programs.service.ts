import { Injectable, inject } from '@angular/core';

import type { Program } from '../../shared/models/program.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ProgramsService {
  private readonly apiService = inject(ApiService);

  async listPrograms(): Promise<Program[]> {
    return this.apiService.get<Program[]>('/programs');
  }
}
