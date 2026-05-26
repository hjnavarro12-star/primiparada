import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { StorageService } from '../../core/services/storage.service';
import { V28AlarmSoundPage } from './v28-alarm-sound-page';

describe('V28AlarmSoundPage', () => {
  const storageMock = {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn()
  };

  beforeEach(async () => {
    storageMock.get.mockResolvedValue(null);
    storageMock.set.mockResolvedValue(undefined);
    storageMock.remove.mockResolvedValue(undefined);

    await TestBed.configureTestingModule({
      imports: [V28AlarmSoundPage],
      providers: [provideRouter([]), { provide: StorageService, useValue: storageMock }]
    }).compileComponents();
  });

  it('renders the list of sounds', async () => {
    const fixture = TestBed.createComponent(V28AlarmSoundPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Sonido de alarma');
    expect(fixture.nativeElement.textContent).toContain('Beep corto');
  });

  it('selects and saves a sound', async () => {
    const fixture = TestBed.createComponent(V28AlarmSoundPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    fixture.componentInstance.selectSound('chime');
    fixture.detectChanges();

    expect(fixture.componentInstance.selected()).toBe('chime');

    await fixture.componentInstance.save();
    fixture.detectChanges();

    expect(storageMock.set).toHaveBeenCalledWith('primiparada.settings.alarmSound', 'chime');
    expect(fixture.componentInstance.message()).toContain('guardado');
  });

  it('previews a sound (updates message)', async () => {
    const fixture = TestBed.createComponent(V28AlarmSoundPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    fixture.componentInstance.previewSound({ id: 'beep', label: 'Beep corto' });
    fixture.detectChanges();

    expect(fixture.componentInstance.message()).toContain('Reproduciendo');
  });
});
