// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/falling-catcher-game/',  
  plugins: [react()],
});
