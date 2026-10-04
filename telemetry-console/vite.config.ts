import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  envDir: '../',
  envPrefix: ['VITE_', 'OPENROUTER_', 'GEMINI_', 'GNANI_', 'HF_', 'TELEGRAM_', 'CAREGIVER_'],
})

