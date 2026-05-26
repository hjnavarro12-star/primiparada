import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { StorageService } from '../../core/services/storage.service';
import { V30ColorPage } from './v30-color-page';

describe('V30ColorPage', () => {
  const storageMock = {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn()
  };

  beforeEach(async () => {
    storageMock.get.mockResolvedValue('#ff9f1c');
    storageMock.set.mockResolvedValue(undefined);
    storageMock.remove.mockResolvedValue(undefined);

    await TestBed.configureTestingModule({
      imports: [V30ColorPage],
      providers: [provideRouter([]), { provide: StorageService, useValue: storageMock }]
    }).compileComponents();
  });

  it('reads initial color and applies CSS var', async () => {
    const fixture = TestBed.createComponent(V30ColorPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.selected()).toBe('#ff9f1c');
    expect(document.documentElement.style.getPropertyValue('--app-accent')).toBe('#ff9f1c');
  });

  it('selects a new color and saves to preferences', async () => {
    const fixture = TestBed.createComponent(V30ColorPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    fixture.componentInstance.selectColor('#5fb2ff');
    fixture.detectChanges();

    expect(fixture.componentInstance.selected()).toBe('#5fb2ff');

    await fixture.componentInstance.save();
    fixture.detectChanges();

    expect(storageMock.set).toHaveBeenCalledWith('primiparada.settings.color', '#5fb2ff');
  });
});
