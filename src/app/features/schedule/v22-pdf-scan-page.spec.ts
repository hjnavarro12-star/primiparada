import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { AuthService } from '../../core/services/auth.service';
import { ScheduleService } from '../../core/services/schedule.service';
import { ScheduleSyncService } from '../../core/services/schedule-sync.service';
import { StorageService } from '../../core/services/storage.service';
import { ApiService } from '../../core/services/api.service';
import { V22PdfScanPage } from './v22-pdf-scan-page';

describe('V22PdfScanPage', () => {
  let scheduleService: ScheduleService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V22PdfScanPage],
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

  it('renders the PDF upload area and displays initial message', () => {
    const fixture = TestBed.createComponent(V22PdfScanPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Escanear PDF');
    expect(fixture.nativeElement.textContent).toContain('Selecciona o arrastra un PDF aquí');
    expect(fixture.componentInstance.message()).toContain('Carga un PDF');
  });

  it('accepts PDF file selection and shows file name', async () => {
    const fixture = TestBed.createComponent(V22PdfScanPage);
    fixture.detectChanges();

    const file = new File(['mock pdf content'], 'schedule.pdf', { type: 'application/pdf' });

    const fileInput = fixture.nativeElement.querySelector('input[type="file"]');
    expect(fileInput).toBeTruthy();

    const event = new Event('change', { bubbles: true });
    Object.defineProperty(fileInput, 'files', {
      value: { 0: file, length: 1 }
    });

    fileInput.dispatchEvent(event);
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedFile()).toBe(file);
    expect(fixture.componentInstance.message()).toContain('schedule.pdf');
  });

  it('clears file when clearFile is called', async () => {
    const fixture = TestBed.createComponent(V22PdfScanPage);
    fixture.detectChanges();

    const file = new File(['mock pdf content'], 'schedule.pdf', { type: 'application/pdf' });

    const fileInput = fixture.nativeElement.querySelector('input[type="file"]');
    Object.defineProperty(fileInput, 'files', {
      value: { 0: file, length: 1 }
    });
    fileInput.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedFile()).toBe(file);

    fixture.componentInstance.clearFile();
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedFile()).toBeNull();
    expect(fixture.componentInstance.extractedClasses()).toEqual([]);
  });

  it('rejects non-PDF files', () => {
    const fixture = TestBed.createComponent(V22PdfScanPage);
    fixture.detectChanges();

    const file = new File(['not a pdf'], 'schedule.txt', { type: 'text/plain' });

    const fileInput = fixture.nativeElement.querySelector('input[type="file"]');
    Object.defineProperty(fileInput, 'files', {
      value: { 0: file, length: 1 }
    });
    fileInput.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.message()).toContain('Por favor, selecciona un archivo PDF válido');
    expect(fixture.componentInstance.selectedFile()).toBeNull();
  });
});
