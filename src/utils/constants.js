// ========== CONSTANTES DU JEU ==========

// Fonction pour obtenir le chemin correct des assets (fonctionne en local et sur GitHub Pages)
export const getAssetPath = (path) => {
  const base = import.meta.env.BASE_URL || '/'
  // Enlève le / initial du path si présent pour éviter les doubles slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${base}${cleanPath}`
}

export const GRID_SIZE = 2 
export const MOVE_SPEED = 0.1 // Vitesse d'interpolation des déplacements
export const PARKING_BOUNDS = {
  minX: -8,
  maxX: 6,
  minZ: -5,
  maxZ: 5
}

// Étages du parking
export const FLOOR_HEIGHT = 3.0 // Hauteur entre chaque étage
export const FLOORS = [
  { level: 0, y: 0, name: 'Rez-de-chaussee' },
  { level: 1, y: -3.0, name: 'Sous-sol -1' },
  { level: 2, y: -6.0, name: 'Sous-sol -2' }
]

export const COLORS = {
  background: 0x1a1a2e,
  floor: 0x2d2d44,
  floorLevel1: 0x3d3d54,
  floorLevel2: 0x4d4d64,
  grid: 0x444466,
  gridCenter: 0x333344,
  highlight: 0x00ff00,
  collision: 0xff0000,
  elevator: 0xffaa00,
  pillar: 0x555566,
  exitZone: 0x00ff88,
  playerVehicle: 0xffdd00
}

export const VEHICLE_COLORS = {
  red: 0xff4444,
  blue: 0x4444ff,
  green: 0x44ff44,
  yellow: 0xffff44,
  orange: 0xff6b35
}

export const DIRECTIONS = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical',
  BOTH: 'both'
}
