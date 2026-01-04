import { defineConfig } from 'vite'

export default defineConfig(({ command }) => ({
  // Utilise le base '/ParkingJam3d/' seulement en production (pour GitHub Pages)
  // En développement, utilise '/' pour que tout fonctionne normalement
  base: command === 'build' ? '/ParkingJam3d/' : '/',
}))
