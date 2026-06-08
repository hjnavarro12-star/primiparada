import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ExitGuard } from './exit.guard';

describe('ExitGuard', () => {
  let guard: ExitGuard;
  let mockAlertController: any;
  let mockAlert: any;

  beforeEach(() => {
    mockAlert = {
      present: vi.fn(),
      onDidDismiss: vi.fn().mockResolvedValue({ role: 'cancel' }),
    };

    mockAlertController = {
      create: vi.fn().mockResolvedValue(mockAlert),
    };

    guard = new ExitGuard(mockAlertController);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should show confirmation alert when deactivating without canExit', async () => {
    mockAlert.onDidDismiss.mockResolvedValue({ role: 'cancel' });

    const result = await guard.canDeactivate(null as any);

    expect(mockAlertController.create).toHaveBeenCalledWith(
      expect.objectContaining({
        header: '¿Salir de la aplicación?',
      })
    );
    expect(mockAlert.present).toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it('should return true when user confirms exit (destructive role)', async () => {
    mockAlert.onDidDismiss.mockResolvedValue({ role: 'destructive' });

    const result = await guard.canDeactivate(null as any);

    expect(result).toBe(true);
  });

  it('should use component canExit if available', async () => {
    const mockComponent = { canExit: vi.fn().mockReturnValue(true) };

    const result = await guard.canDeactivate(mockComponent as any);

    expect(mockComponent.canExit).toHaveBeenCalled();
    expect(mockAlertController.create).not.toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('should handle component canExit returning false', async () => {
    const mockComponent = { canExit: vi.fn().mockReturnValue(false) };

    const result = await guard.canDeactivate(mockComponent as any);

    expect(result).toBe(false);
    expect(mockAlertController.create).not.toHaveBeenCalled();
  });
});
