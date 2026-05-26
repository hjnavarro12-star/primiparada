import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { V1Dashboard } from './v1-dashboard';

describe('V1Dashboard', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V1Dashboard],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('renders welcome and action links', () => {
    const fixture = TestBed.createComponent(V1Dashboard);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Bienvenidos');
    expect(fixture.nativeElement.querySelector('a[href="/access/v2"]')).toBeTruthy();
  });
});
import { render } from '@testing-library/angular';
import { V1Dashboard } from './v1-dashboard';

describe('V1Dashboard', () => {
  it('renders title, media section and action buttons', async () => {
    const { getByText, container } = await render(V1Dashboard);

    expect(getByText(/Bienvenidos a Primíparos de la UnPa/i)).toBeTruthy();
    expect(getByText(/Noticias UnPa/i)).toBeTruthy();

    const iframes = container.querySelectorAll('iframe');
    expect(iframes.length).toBeGreaterThanOrEqual(1);

    const videoIframe = container.querySelector('iframe[title*="Video introductorio"]');
    expect(videoIframe).toBeTruthy();
    expect(videoIframe?.getAttribute('loading')).toBe('lazy');

    expect(getByText(/Iniciar sesión/i).closest('ion-button')).toBeTruthy();
    expect(getByText(/Registrarse/i).closest('ion-button')).toBeTruthy();
  });
});
