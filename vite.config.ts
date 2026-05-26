import { defineConfig } from 'vite';
import * as path from 'path';

export default defineConfig({
  resolve: {
    alias: [
      // Durante Vitest, sustituir Ionic por mocks Angular livianos para evitar cargar el runtime ESM real.
      { find: '@ionic/angular/standalone', replacement: path.resolve(__dirname, 'src/testing/ionic-standalone.mock.ts') }
    ]
  },
  test: {
    environment: 'jsdom',
    setupFiles: 'src/test-setup.ts'
  }
});
