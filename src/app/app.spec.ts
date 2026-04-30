import { App } from './app';
import { VIEW_GROUPS, VIEW_SPECS } from './view-catalog';

describe('App', () => {
  it('should instantiate App class', () => {
    const app = new App();
    expect(app).toBeTruthy();
  });

  it('should expose sprint navigation groups and views', () => {
    expect(Array.isArray(VIEW_GROUPS)).toBe(true);
    expect(Array.isArray(VIEW_SPECS)).toBe(true);

    // Chequeos básicos de contenido esperado
    const names = VIEW_GROUPS.map(g => g.title).join(' ');
    expect(names).toContain('Acceso');

    const routePaths = VIEW_SPECS.map(v => v.routePath).join(' ');
    expect(routePaths).toContain('access');
    expect(routePaths).toContain('schedule');
  });
});
