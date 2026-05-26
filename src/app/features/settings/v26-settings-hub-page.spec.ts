import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { V26SettingsHubPage } from './v26-settings-hub-page';

describe('V26SettingsHubPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V26SettingsHubPage],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('renders the settings hub with shortcuts', () => {
    const fixture = TestBed.createComponent(V26SettingsHubPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Configuraciones generales');
    expect(fixture.nativeElement.textContent).toContain('V27');
    expect(fixture.nativeElement.textContent).toContain('V31');
  });

  it('updates the preview font size within bounds', () => {
    const fixture = TestBed.createComponent(V26SettingsHubPage);
    fixture.detectChanges();

    expect(fixture.componentInstance.fontSize()).toBe(16);

    fixture.componentInstance.increaseFont();
    fixture.componentInstance.increaseFont();
    fixture.detectChanges();

    expect(fixture.componentInstance.fontSize()).toBe(18);

    fixture.componentInstance.decreaseFont();
    fixture.detectChanges();

    expect(fixture.componentInstance.fontSize()).toBe(17);
  });

  it('switches the preview theme label', () => {
    const fixture = TestBed.createComponent(V26SettingsHubPage);
    fixture.detectChanges();

    expect(fixture.componentInstance.currentThemeLabel()).toBe('Azul institucional');

    fixture.componentInstance.setTheme('green');
    fixture.detectChanges();

    expect(fixture.componentInstance.currentThemeLabel()).toBe('Verde natural');
  });
});