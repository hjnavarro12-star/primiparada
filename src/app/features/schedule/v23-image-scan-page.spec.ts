import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { AuthService } from '../../core/services/auth.service';
import { ScheduleService } from '../../core/services/schedule.service';
import { ScheduleSyncService } from '../../core/services/schedule-sync.service';
import { StorageService } from '../../core/services/storage.service';
import { ApiService } from '../../core/services/api.service';
import { V23ImageScanPage } from './v23-image-scan-page';

describe('V23ImageScanPage', () => {
  let scheduleService: ScheduleService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V23ImageScanPage],
      providers: [
        provideRouter([]),
        { provide: StorageService, useValue: { get: async () => null, set: async () => void 0, remove: async () => void 0 } },
        { provide: AuthService, useValue: { user$: undefined, userSnapshot: { id: 'user-0-test' } } },
        {
          provide: ApiService,
          useValue: { post: vi.fn().mockResolvedValue({}), get: vi.fn().mockResolvedValue([]) }
        },
        { provide: ScheduleSyncService, useValue: { queueScheduleChanges: vi.fn().mockResolvedValue(void 0) } }
      ]
    }).compileComponents();

    scheduleService = TestBed.inject(ScheduleService);
    scheduleService.setSchedules([]);
  });

  it('renders the image upload area and displays initial message', () => {
    const fixture = TestBed.createComponent(V23ImageScanPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Escanear imagen');
    expect(fixture.nativeElement.textContent).toContain('Selecciona o arrastra una imagen aquí');
    expect(fixture.componentInstance.message()).toContain('Captura o selecciona');
  });

  it('accepts image file selection and shows file name', async () => {
    const fixture = TestBed.createComponent(V23ImageScanPage);
    fixture.detectChanges();

    const imageData = new Uint8Array([137, 80, 78, 71]);
    const file = new File([imageData], 'schedule.png', { type: 'image/png' });

    const fileInput = fixture.nativeElement.querySelector('input[type="file"]');
    expect(fileInput).toBeTruthy();

    Object.defineProperty(fileInput, 'files', {
      value: { 0: file, length: 1 }
    });

    fileInput.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedImage()).toBe(file);
    expect(fixture.componentInstance.message()).toContain('schedule.png');
  });

  it('displays image preview when image is loaded', async () => {
    const fixture = TestBed.createComponent(V23ImageScanPage);
    fixture.detectChanges();

    const imageData = new Uint8Array([137, 80, 78, 71]);
    const file = new File([imageData], 'schedule.png', { type: 'image/png' });

    const fileInput = fixture.nativeElement.querySelector('input[type="file"]');
    Object.defineProperty(fileInput, 'files', {
      value: { 0: file, length: 1 }
    });

    fileInput.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    await new Promise((resolve) => setTimeout(resolve, 200));
    fixture.detectChanges();

    expect(fixture.componentInstance.imagePreview()).toBeTruthy();
    expect(fixture.componentInstance.imagePreview().startsWith('data:')).toBe(true);
  });

  it('clears image when clearImage is called', async () => {
    const fixture = TestBed.createComponent(V23ImageScanPage);
    fixture.detectChanges();

    const imageData = new Uint8Array([137, 80, 78, 71]);
    const file = new File([imageData], 'schedule.png', { type: 'image/png' });

    const fileInput = fixture.nativeElement.querySelector('input[type="file"]');
    Object.defineProperty(fileInput, 'files', {
      value: { 0: file, length: 1 }
    });

    fileInput.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedImage()).toBe(file);

    fixture.componentInstance.clearImage();
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedImage()).toBeNull();
    expect(fixture.componentInstance.imagePreview()).toBe('');
    expect(fixture.componentInstance.extractedClasses()).toEqual([]);
  });

  it('rejects non-image files', () => {
    const fixture = TestBed.createComponent(V23ImageScanPage);
    fixture.detectChanges();

    const file = new File(['not an image'], 'schedule.txt', { type: 'text/plain' });

    const fileInput = fixture.nativeElement.querySelector('input[type="file"]');
    Object.defineProperty(fileInput, 'files', {
      value: { 0: file, length: 1 }
    });

    fileInput.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.message()).toContain('Por favor, selecciona una imagen válida');
    expect(fixture.componentInstance.selectedImage()).toBeNull();
  });
});
