import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';

import { ProgramsService } from './programs.service';
import { ApiService } from './api.service';

describe('ProgramsService', () => {
  it('returns the catalog from the API', async () => {
    const apiGet = vi.fn().mockResolvedValue([
      { id: 'db-1', code: 'ART', name: 'Arte Digital', faculty: 'Artes' }
    ]);

    await TestBed.configureTestingModule({
      providers: [
        ProgramsService,
        { provide: ApiService, useValue: { get: apiGet } }
      ]
    }).compileComponents();

    const service = TestBed.inject(ProgramsService);

    await expect(service.listPrograms()).resolves.toEqual([
      { id: 'db-1', code: 'ART', name: 'Arte Digital', faculty: 'Artes' }
    ]);
    expect(apiGet).toHaveBeenCalledWith('/programs');
  });

  it('propagates API errors', async () => {
    const apiGet = vi.fn().mockRejectedValue(new Error('network down'));

    await TestBed.configureTestingModule({
      providers: [
        ProgramsService,
        { provide: ApiService, useValue: { get: apiGet } }
      ]
    }).compileComponents();

    const service = TestBed.inject(ProgramsService);

    await expect(service.listPrograms()).rejects.toThrow('network down');
  });
});
