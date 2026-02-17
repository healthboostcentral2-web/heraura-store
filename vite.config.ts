import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as fs from 'fs';
import * as path from 'path';

// Plugin to ensure Netlify _redirects file is generated in dist
const netlifyRedirect = () => ({
  name: 'netlify-redirect',
  writeBundle() {
    const dir = path.resolve('dist');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const filePath = path.join(dir, '_redirects');
    fs.writeFileSync(filePath, '/* /index.html 200');
    console.log('_redirects file created in dist/');
  }
});

export default defineConfig({
  plugins: [react(), netlifyRedirect()],
  publicDir: 'public',
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});