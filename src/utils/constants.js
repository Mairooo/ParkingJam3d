// ========== CONSTANTES DU JEU ==========

export const GRID_SIZE = 2 
export const MOVE_SPEED = 0.1 // Vitesse d'interpolation des déplacements
export const PARKING_BOUNDS = {
  min: -8,
  max: 8
}

// Étages du parking
export const FLOOR_HEIGHT = 4 // Hauteur entre chaque étage
export const FLOORS = [
  { level: 0, y: 0, name: 'Rez-de-chaussee' },
  { level: 1, y: -4, name: 'Sous-sol -1' },
  { level: 2, y: -8, name: 'Sous-sol -2' }
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
  pillar: 0x555566
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
