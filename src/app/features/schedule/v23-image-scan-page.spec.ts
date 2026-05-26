import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { vi } from 'vitest';

import { AuthService } from '../../core/services/auth.service';
import { ScheduleService } from '../../core/services/schedule.service';
import { ScheduleSyncService } from '../../core/services/schedule-sync.service';
import { StorageService } from '../../core/services/storage.service';
import { SupabaseClientService } from '../../core/services/supabase-client.service';
import { V23ImageScanPage } from './v23-image-scan-page';

describe('V23ImageScanPage', () => {
  let scheduleService: ScheduleService;
  const sessionSubject = new BehaviorSubject<{ user: { id: string } } | null>({ user: { id: 'user-0-test' } });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V23ImageScanPage],
      providers: [
        provideRouter([]),
        { provide: StorageService, useValue: { get: async () => null, set: async () => void 0, remove: async () => void 0 } },
        { provide: AuthService, useValue: { session$: sessionSubject.asObservable(), sessionSnapshot: { user: { id: 'user-0-test' } } } },
        {
          provide: SupabaseClientService,
          useValue: { client: { from: () => ({ upsert: vi.fn().mockResolvedValue({ error: null }), delete: () => ({ in: vi.fn() }), insert: vi.fn() }) } }
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

  it('accepts image file selection and displays preview', async () => {
    const fixture = TestBed.createComponent(V23ImageScanPage);
    fixture.detectChanges();

    const imageData = new Uint8Array([137, 80, 78, 71]); // PNG header
    const file = new File([imageData], 'schedule.png', { type: 'image/png' });

    // Simulate file input change
    const fileInput = fixture.nativeElement.querySelector('input[type="file"]');
    expect(fileInput).toBeTruthy();

    Object.defineProperty(fileInput, 'files', {
      value: { 0: file, length: 1 }
    });

    fileInput.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    // The file should be set
    expect(fixture.componentInstance.selectedImage()).toBe(file);

    // Wait for image preview load and extraction
    await new Promise((resolve) => setTimeout(resolve, 1200));
    fixture.detectChanges();

    // Mock classes should be extracted
    expect(fixture.componentInstance.extractedClasses().length).toBe(4);
    expect(fixture.componentInstance.extractedClasses()[0].subject).toBe('Álgebra Lineal');
  });

  it('displays image preview when image is loaded', async () => {
    const fixture = TestBed.createComponent(V23ImageScanPage);
    fixture.detectChanges();

    const imageData = new Uint8Array([137, 80, 78, 71]); // PNG header
    const file = new File([imageData], 'schedule.png', { type: 'image/png' });

    const fileInput = fixture.nativeElement.querySelector('input[type="file"]');
    Object.defineProperty(fileInput, 'files', {
      value: { 0: file, length: 1 }
    });

    fileInput.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    // Wait for FileReader to complete
    await new Promise((resolve) => setTimeout(resolve, 200));
    fixture.detectChanges();

    // Preview should be set (data URL)
    expect(fixture.componentInstance.imagePreview()).toBeTruthy();
    expect(fixture.componentInstance.imagePreview().startsWith('data:')).toBe(true);
  });

  it('clears image and extracted classes when clearImage is called', async () => {
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

    // Wait for extraction
    await new Promise((resolve) => setTimeout(resolve, 1000));
    fixture.detectChanges();

    expect(fixture.componentInstance.extractedClasses().length).toBeGreaterThan(0);

    // Clear
    fixture.componentInstance.clearImage();
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedImage()).toBeNull();
    expect(fixture.componentInstance.imagePreview()).toBe('');
    expect(fixture.componentInstance.extractedClasses()).toEqual([]);
  });

  it('saves extracted classes to the schedule service', async () => {
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

    // Wait for extraction
    await new Promise((resolve) => setTimeout(resolve, 1000));
    fixture.detectChanges();

    // Save extracted
    fixture.componentInstance.saveExtracted();

    expect(scheduleService.schedulesSnapshot).toHaveLength(4);
    expect(scheduleService.schedulesSnapshot[0].subject).toBe('Álgebra Lineal');
    expect(fixture.componentInstance.message()).toContain('4 clase(s)');
    expect(fixture.componentInstance.selectedImage()).toBeNull();
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
