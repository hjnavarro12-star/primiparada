import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { StorageService } from '../../core/services/storage.service';
import { V27FontSizePage } from './v27-font-size-page';

describe('V27FontSizePage', () => {
  const storageMock = {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn()
  };

  beforeEach(async () => {
    storageMock.get.mockResolvedValue('16');
    storageMock.set.mockResolvedValue(undefined);
    storageMock.remove.mockResolvedValue(undefined);

    await TestBed.configureTestingModule({
      imports: [V27FontSizePage],
      providers: [provideRouter([]), { provide: StorageService, useValue: storageMock }]
    }).compileComponents();
  });

  it('renders the font size control and initial preview', async () => {
    const fixture = TestBed.createComponent(V27FontSizePage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Tamaño de letra');
    expect(fixture.componentInstance.fontSize()).toBe(16);
    expect(fixture.nativeElement.querySelector('input[type="range"]')).toBeTruthy();
  });

  it('updates the font size when the slider changes', async () => {
    const fixture = TestBed.createComponent(V27FontSizePage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    fixture.componentInstance.onSliderChange({ target: { value: '19' } } as unknown as Event);
    fixture.detectChanges();

    expect(fixture.componentInstance.fontSize()).toBe(19);
    expect(storageMock.set).toHaveBeenCalledWith('primiparada.settings.fontSize', '19');
    expect(document.documentElement.style.getPropertyValue('--app-font-size')).toBe('19px');
  });

  it('restores the default size when reset is clicked', async () => {
    const fixture = TestBed.createComponent(V27FontSizePage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    fixture.componentInstance.setSize(20);
    fixture.componentInstance.resetSize();
    fixture.detectChanges();

    expect(fixture.componentInstance.fontSize()).toBe(16);
    expect(fixture.componentInstance.message()).toContain('restablecido');
  });
});