import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { vi } from 'vitest';

import { AuthService } from '../../core/services/auth.service';
import { ScheduleService } from '../../core/services/schedule.service';
import { ScheduleSyncService } from '../../core/services/schedule-sync.service';
import { StorageService } from '../../core/services/storage.service';
import { SupabaseClientService } from '../../core/services/supabase-client.service';
import { V22PdfScanPage } from './v22-pdf-scan-page';

describe('V22PdfScanPage', () => {
  let scheduleService: ScheduleService;
  const sessionSubject = new BehaviorSubject<{ user: { id: string } } | null>({ user: { id: 'user-0-test' } });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V22PdfScanPage],
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

  it('renders the PDF upload area and displays initial message', () => {
    const fixture = TestBed.createComponent(V22PdfScanPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Escanear PDF');
    expect(fixture.nativeElement.textContent).toContain('Selecciona o arrastra un PDF aquí');
    expect(fixture.componentInstance.message()).toContain('Carga un PDF');
  });

  it('accepts PDF file selection and extracts mock classes', async () => {
    const fixture = TestBed.createComponent(V22PdfScanPage);
    fixture.detectChanges();

    const file = new File(['mock pdf content'], 'schedule.pdf', { type: 'application/pdf' });

    // Simulate file input change
    const fileInput = fixture.nativeElement.querySelector('input[type="file"]');
    expect(fileInput).toBeTruthy();

    // Create a custom event to simulate file selection
    const event = new Event('change', { bubbles: true });
    Object.defineProperty(fileInput, 'files', {
      value: { 0: file, length: 1 }
    });

    fileInput.dispatchEvent(event);
    fixture.detectChanges();

    // The file should be set
    expect(fixture.componentInstance.selectedFile()).toBe(file);

    // Wait for mock extraction to complete
    await new Promise((resolve) => setTimeout(resolve, 1000));
    fixture.detectChanges();

    // Mock classes should be extracted
    expect(fixture.componentInstance.extractedClasses().length).toBe(3);
    expect(fixture.componentInstance.extractedClasses()[0].subject).toBe('Cálculo I');
  });

  it('clears file and extracted classes when clearFile is called', async () => {
    const fixture = TestBed.createComponent(V22PdfScanPage);
    fixture.detectChanges();

    const file = new File(['mock pdf content'], 'schedule.pdf', { type: 'application/pdf' });

    // Simulate file selection
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
    fixture.componentInstance.clearFile();
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedFile()).toBeNull();
    expect(fixture.componentInstance.extractedClasses()).toEqual([]);
  });

  it('saves extracted classes to the schedule service', async () => {
    const fixture = TestBed.createComponent(V22PdfScanPage);
    fixture.detectChanges();

    const file = new File(['mock pdf content'], 'schedule.pdf', { type: 'application/pdf' });

    // Simulate file selection
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

    expect(scheduleService.schedulesSnapshot).toHaveLength(3);
    expect(scheduleService.schedulesSnapshot[0].subject).toBe('Cálculo I');
    expect(fixture.componentInstance.message()).toContain('3 clase(s)');
    expect(fixture.componentInstance.selectedFile()).toBeNull();
  });

  it('rejects non-PDF files', () => {
    const fixture = TestBed.createComponent(V22PdfScanPage);
    fixture.detectChanges();

    const file = new File(['not a pdf'], 'schedule.txt', { type: 'text/plain' });

    // Simulate file selection
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
