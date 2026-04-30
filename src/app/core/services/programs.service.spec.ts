import { describe, expect, it, vi } from 'vitest';

import { FALLBACK_PROGRAMS, ProgramsService } from './programs.service';

describe('ProgramsService', () => {
  it('returns the Supabase catalog when the query succeeds', async () => {
    const clientService = {
      client: {
        from: vi.fn(() => ({
          select: vi.fn(() => ({
            order: vi.fn(async () => ({
              data: [
                { id: 'db-1', code: 'ART', name: 'Arte Digital', faculty: 'Artes' }
              ],
              error: null
            }))
          }))
        }))
      }
    };

    const service = new ProgramsService(clientService as never);

    await expect(service.listPrograms()).resolves.toEqual([
      { id: 'db-1', code: 'ART', name: 'Arte Digital', faculty: 'Artes' }
    ]);
  });

  it('falls back to the local catalog when Supabase fails', async () => {
    const clientService = {
      client: {
        from: vi.fn(() => ({
          select: vi.fn(() => ({
            order: vi.fn(async () => ({
              data: null,
              error: { message: 'network down' }
            }))
          }))
        }))
      }
    };

    const service = new ProgramsService(clientService as never);

    await expect(service.listPrograms()).resolves.toEqual(FALLBACK_PROGRAMS);
  });

  it('falls back to the local catalog when Supabase returns an empty set', async () => {
    const clientService = {
      client: {
        from: vi.fn(() => ({
          select: vi.fn(() => ({
            order: vi.fn(async () => ({
              data: [],
              error: null
            }))
          }))
        }))
      }
    };

    const service = new ProgramsService(clientService as never);

    await expect(service.listPrograms()).resolves.toEqual(FALLBACK_PROGRAMS);
  });
});
