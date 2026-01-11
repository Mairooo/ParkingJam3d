import * as THREE from 'three'
import { DIRECTIONS, FLOORS, getAssetPath } from '../utils/constants.js'

/**
 * PARKING JAM 3D - NIVEAUX AVEC SOLUTIONS PRÉ-ENREGISTRÉES
 * 
 * Chaque niveau peut avoir une solution pré-enregistrée qui prouve qu'il est résoluble.
 * Format solution: { vehicle: index, dir: 'up'|'down'|'left'|'right'|'elevator-up'|'elevator-down' }
 * - vehicle 0 = taxi (joueur)
 * - vehicle 1, 2, 3... = obstacles dans l'ordre de déclaration
 */
export const LEVELS = {
  // ============================================
  // NIVEAU 1 - Puzzle Rush Hour 36 mouvements par étage
  // Basé sur: HooLBBHJoLMNIJAAMNIxKDDNEEKoooooxGGo
  // ============================================
  1: {
    name: 'Niveau 1 - Débutant',
    floors: 3,
    exitFloor: 2,
    exitPosition: { x: -8, z: 0 },
    elevators: [
      { x: -8, z: 0, floorIndex: 0 },
      { x: 4, z: 0, floorIndex: 1 }
    ],
    player: {
      model: '/models/taxi.glb',
      position: { x: 0, y: 0, z: 0 },
      direction: DIRECTIONS.HORIZONTAL,
      rotation: Math.PI / 2
    },
    vehicles: [
      // ========== ÉTAGE 0 - Puzzle Rush Hour adapté ==========
      // Grille: HooLBB / HJoLMN / IJAAMN / IxKDDN / EEKooo / ooxGGo
      // Adapté à notre grille (x: -6 à 4, z: -4 à 4)
      
      // H: Vertical (col 0, rows 0-1) -> x=-6, z=2 à z=4
      { model: '/models/van.glb', position: { x: -6, y: 0, z: 4 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      // L: Vertical (col 3, rows 0-2) -> x=0, z=2 à z=4  
      { model: '/models/truck-flat.glb', position: { x: 0, y: 0, z: 4 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      // B: Horizontal (col 4-5, row 0) -> x=2 à 4, z=4
      { model: '/models/delivery.glb', position: { x: 4, y: 0, z: 4 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      // J: Vertical (col 1, rows 1-2) -> x=-4, z=0 à z=2
      { model: '/models/van.glb', position: { x: -4, y: 0, z: 2 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      // M: Vertical (col 4, rows 1-3) -> x=2, z=0 à z=4
      { model: '/models/truck-flat.glb', position: { x: 2, y: 0, z: 2 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      // N: Vertical (col 5, rows 1-3) -> x=4, z=0 à z=2
      { model: '/models/delivery.glb', position: { x: 4, y: 0, z: 2 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      // I: Vertical (col 0, rows 2-3) -> x=-6, z=-2 à z=0
      { model: '/models/van.glb', position: { x: -6, y: 0, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      // K: Vertical (col 2, rows 3-4) -> x=-2, z=-4 à z=-2
      { model: '/models/truck-flat.glb', position: { x: -2, y: 0, z: -2 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      // D: Horizontal (col 3-4, row 3) -> x=0 à 2, z=-2
      { model: '/models/delivery.glb', position: { x: 2, y: 0, z: -2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      // E: Horizontal (col 0-1, row 4) -> x=-6 à -4, z=-4
      { model: '/models/van.glb', position: { x: -4, y: 0, z: -4 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      // G: Horizontal (col 3-4, row 5) -> x=0 à 2, z=-4 (mais hors grille, on adapte)
      { model: '/models/truck-flat.glb', position: { x: 2, y: 0, z: -4 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      
      // ========== ÉTAGE -1 - Second puzzle complexe ==========
      // Configuration différente mais même difficulté
      { model: '/models/van.glb', position: { x: 2, y: -3, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/truck-flat.glb', position: { x: 0, y: -3, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/delivery.glb', position: { x: -2, y: -3, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      
      { model: '/models/van.glb', position: { x: 4, y: -3, z: 2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/truck-flat.glb', position: { x: 2, y: -3, z: 2 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/delivery.glb', position: { x: 0, y: -3, z: 2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/van.glb', position: { x: -2, y: -3, z: 2 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      
      { model: '/models/truck-flat.glb', position: { x: 4, y: -3, z: -2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/delivery.glb', position: { x: 2, y: -3, z: -2 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/van.glb', position: { x: 0, y: -3, z: -2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/truck-flat.glb', position: { x: -2, y: -3, z: -2 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      
      { model: '/models/delivery.glb', position: { x: 2, y: -3, z: 4 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/van.glb', position: { x: -2, y: -3, z: -4 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      
      // ========== ÉTAGE -2 - Puzzle devant la sortie ==========
      { model: '/models/truck-flat.glb', position: { x: -6, y: -6, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/van.glb', position: { x: -4, y: -6, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/delivery.glb', position: { x: -2, y: -6, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      
      { model: '/models/van.glb', position: { x: -6, y: -6, z: 2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/truck-flat.glb', position: { x: -4, y: -6, z: 2 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/delivery.glb', position: { x: -2, y: -6, z: 2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      
      { model: '/models/truck-flat.glb', position: { x: -6, y: -6, z: -2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/van.glb', position: { x: -4, y: -6, z: -2 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/delivery.glb', position: { x: -2, y: -6, z: -2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      
      { model: '/models/van.glb', position: { x: -4, y: -6, z: 4 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/truck-flat.glb', position: { x: -4, y: -6, z: -4 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 }
    ],
    solution: [
      // 34 mouvements
      { vehicle: 7, dir: 'down' },
      { vehicle: 0, dir: 'left' },
      { vehicle: 0, dir: 'left' },
      { vehicle: 0, dir: 'left' },
      { vehicle: 0, dir: 'left' },
      { vehicle: 0, dir: 'elevator-down' },
      { vehicle: 18, dir: 'down' },
      { vehicle: 17, dir: 'left' },
      { vehicle: 17, dir: 'left' },
      { vehicle: 14, dir: 'down' },
      { vehicle: 13, dir: 'down' },
      { vehicle: 23, dir: 'left' },
      { vehicle: 16, dir: 'down' },
      { vehicle: 12, dir: 'down' },
      { vehicle: 0, dir: 'right' },
      { vehicle: 0, dir: 'right' },
      { vehicle: 0, dir: 'right' },
      { vehicle: 0, dir: 'right' },
      { vehicle: 0, dir: 'right' },
      { vehicle: 0, dir: 'right' },
      { vehicle: 0, dir: 'elevator-down' },
      { vehicle: 33, dir: 'right' },
      { vehicle: 27, dir: 'up' },
      { vehicle: 34, dir: 'right' },
      { vehicle: 29, dir: 'down' },
      { vehicle: 26, dir: 'down' },
      { vehicle: 28, dir: 'left' },
      { vehicle: 25, dir: 'down' },
      { vehicle: 0, dir: 'left' },
      { vehicle: 0, dir: 'left' },
      { vehicle: 0, dir: 'left' },
      { vehicle: 0, dir: 'left' },
      { vehicle: 0, dir: 'left' },
      { vehicle: 0, dir: 'left' }
    ]
  },

  // ============================================
  // NIVEAU 2 - Encore plus complexe
  // Basé sur puzzles 40+ mouvements
  // ============================================
  2: {
    name: 'Niveau 2 - Intermédiaire',
    floors: 3,
    exitFloor: 2,
    exitPosition: { x: -8, z: 0 },
    elevators: [
      { x: -8, z: 0, floorIndex: 0 },
      { x: 4, z: 0, floorIndex: 1 }
    ],
    player: {
      model: '/models/taxi.glb',
      position: { x: 4, y: 0, z: 0 },
      direction: DIRECTIONS.HORIZONTAL,
      rotation: Math.PI / 2
    },
    vehicles: [
      // ========== ÉTAGE 0 - Grille dense style Rush Hour expert ==========
      // Ligne z=0 bloquée par verticaux
      { model: '/models/van.glb', position: { x: 2, y: 0, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/truck-flat.glb', position: { x: 0, y: 0, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/delivery.glb', position: { x: -2, y: 0, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/van.glb', position: { x: -4, y: 0, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/truck-flat.glb', position: { x: -6, y: 0, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      
      // z=2: Alternance H-V-H-V (damier)
      { model: '/models/delivery.glb', position: { x: 4, y: 0, z: 2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/van.glb', position: { x: 2, y: 0, z: 2 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/truck-flat.glb', position: { x: 0, y: 0, z: 2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/delivery.glb', position: { x: -2, y: 0, z: 2 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/van.glb', position: { x: -4, y: 0, z: 2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/truck-flat.glb', position: { x: -6, y: 0, z: 2 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      
      // z=-2: Alternance inverse V-H-V-H
      { model: '/models/van.glb', position: { x: 4, y: 0, z: -2 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/delivery.glb', position: { x: 2, y: 0, z: -2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/truck-flat.glb', position: { x: 0, y: 0, z: -2 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/van.glb', position: { x: -2, y: 0, z: -2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/delivery.glb', position: { x: -4, y: 0, z: -2 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/truck-flat.glb', position: { x: -6, y: 0, z: -2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      
      // z=4: Couche de blocage supérieure
      { model: '/models/van.glb', position: { x: 4, y: 0, z: 4 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/delivery.glb', position: { x: 0, y: 0, z: 4 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/truck-flat.glb', position: { x: -4, y: 0, z: 4 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      
      // z=-4: Couche de blocage inférieure
      { model: '/models/delivery.glb', position: { x: 2, y: 0, z: -4 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/van.glb', position: { x: -2, y: 0, z: -4 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      
      // ========== ÉTAGE -1 - Configuration miroir ==========
      { model: '/models/van.glb', position: { x: 2, y: -3, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/truck-flat.glb', position: { x: 0, y: -3, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/delivery.glb', position: { x: -2, y: -3, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/van.glb', position: { x: -4, y: -3, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      
      { model: '/models/truck-flat.glb', position: { x: 4, y: -3, z: 2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/delivery.glb', position: { x: 2, y: -3, z: 2 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/van.glb', position: { x: 0, y: -3, z: 2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/truck-flat.glb', position: { x: -2, y: -3, z: 2 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/delivery.glb', position: { x: -4, y: -3, z: 2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      
      { model: '/models/van.glb', position: { x: 4, y: -3, z: -2 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/truck-flat.glb', position: { x: 2, y: -3, z: -2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/delivery.glb', position: { x: 0, y: -3, z: -2 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/van.glb', position: { x: -2, y: -3, z: -2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/truck-flat.glb', position: { x: -4, y: -3, z: -2 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      
      { model: '/models/delivery.glb', position: { x: 2, y: -3, z: 4 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/van.glb', position: { x: -2, y: -3, z: 4 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/truck-flat.glb', position: { x: 0, y: -3, z: -4 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      
      // ========== ÉTAGE -2 - Boss ==========
      { model: '/models/truck-flat.glb', position: { x: -6, y: -6, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/van.glb', position: { x: -4, y: -6, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/delivery.glb', position: { x: -2, y: -6, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/truck-flat.glb', position: { x: 0, y: -6, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      
      { model: '/models/van.glb', position: { x: -6, y: -6, z: 2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/delivery.glb', position: { x: -4, y: -6, z: 2 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/truck-flat.glb', position: { x: -2, y: -6, z: 2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/van.glb', position: { x: 0, y: -6, z: 2 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      
      { model: '/models/delivery.glb', position: { x: -6, y: -6, z: -2 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/truck-flat.glb', position: { x: -4, y: -6, z: -2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/van.glb', position: { x: -2, y: -6, z: -2 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/delivery.glb', position: { x: 0, y: -6, z: -2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      
      { model: '/models/truck-flat.glb', position: { x: -4, y: -6, z: 4 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/van.glb', position: { x: -2, y: -6, z: -4 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 }
    ],
    solution: [
      // 59 mouvements
      { vehicle: 11, dir: 'down' },
      { vehicle: 5, dir: 'down' },
      { vehicle: 16, dir: 'up' },
      { vehicle: 4, dir: 'up' },
      { vehicle: 9, dir: 'down' },
      { vehicle: 3, dir: 'down' },
      { vehicle: 14, dir: 'up' },
      { vehicle: 2, dir: 'up' },
      { vehicle: 7, dir: 'down' },
      { vehicle: 1, dir: 'down' },
      // 7x left
      { vehicle: 0, dir: 'left' },
      { vehicle: 0, dir: 'left' },
      { vehicle: 0, dir: 'left' },
      { vehicle: 0, dir: 'left' },
      { vehicle: 0, dir: 'left' },
      { vehicle: 0, dir: 'left' },
      { vehicle: 0, dir: 'elevator-down' },
      { vehicle: 31, dir: 'left' },
      { vehicle: 26, dir: 'down' },
      { vehicle: 36, dir: 'up' },
      { vehicle: 35, dir: 'left' },
      { vehicle: 25, dir: 'up' },
      { vehicle: 39, dir: 'left' },
      { vehicle: 34, dir: 'up' },
      { vehicle: 24, dir: 'up' },
      { vehicle: 32, dir: 'down' },
      // 2x up
      { vehicle: 32, dir: 'up' },
      { vehicle: 32, dir: 'up' },
      { vehicle: 33, dir: 'right' },
      { vehicle: 23, dir: 'up' },
      // 8x right
      { vehicle: 0, dir: 'right' },
      { vehicle: 0, dir: 'right' },
      { vehicle: 0, dir: 'right' },
      { vehicle: 0, dir: 'right' },
      { vehicle: 0, dir: 'right' },
      { vehicle: 0, dir: 'right' },
      { vehicle: 0, dir: 'elevator-down' },
      { vehicle: 47, dir: 'down' },
      { vehicle: 43, dir: 'down' },
      { vehicle: 51, dir: 'right' },
      { vehicle: 43, dir: 'up' },
      // 2x right
      { vehicle: 46, dir: 'right' },
      { vehicle: 46, dir: 'right' },
      { vehicle: 43, dir: 'down' },
      { vehicle: 42, dir: 'down' },
      { vehicle: 52, dir: 'right' },
      { vehicle: 45, dir: 'down' },
      { vehicle: 41, dir: 'down' },
      { vehicle: 44, dir: 'left' },
      { vehicle: 40, dir: 'down' },
      // 5x + 1x left = 6x left
      { vehicle: 0, dir: 'left' },
      { vehicle: 0, dir: 'left' },
      { vehicle: 0, dir: 'left' },
      { vehicle: 0, dir: 'left' },
      { vehicle: 0, dir: 'left' },
      { vehicle: 0, dir: 'left' },

    ]
  },

  // ============================================
  // NIVEAU 3 - EXPERT ULTIME
  // Inspiré des puzzles 50+ mouvements
  // ============================================
  3: {
    name: 'Niveau 3 - Expert',
    floors: 3,
    exitFloor: 2,
    exitPosition: { x: -8, z: 0 },
    elevators: [
      { x: -8, z: 0, floorIndex: 0 },
      { x: 4, z: 0, floorIndex: 1 }
    ],
    player: {
      model: '/models/taxi.glb',
      position: { x: 4, y: 0, z: 0 },
      direction: DIRECTIONS.HORIZONTAL,
      rotation: Math.PI / 2
    },
    vehicles: [
      // ========== ÉTAGE 0 - ENFER TOTAL ==========
      // Mur complet de verticaux sur z=0
      { model: '/models/van.glb', position: { x: 2, y: 0, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/truck-flat.glb', position: { x: 0, y: 0, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/delivery.glb', position: { x: -2, y: 0, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/van.glb', position: { x: -4, y: 0, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/truck-flat.glb', position: { x: -6, y: 0, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      
      // z=2: Grille complète alternée
      { model: '/models/delivery.glb', position: { x: 4, y: 0, z: 2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/van.glb', position: { x: 2, y: 0, z: 2 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/truck-flat.glb', position: { x: 0, y: 0, z: 2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/delivery.glb', position: { x: -2, y: 0, z: 2 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/van.glb', position: { x: -4, y: 0, z: 2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/truck-flat.glb', position: { x: -6, y: 0, z: 2 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      
      // z=-2: Grille complète alternée inverse
      { model: '/models/van.glb', position: { x: 4, y: 0, z: -2 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/delivery.glb', position: { x: 2, y: 0, z: -2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/truck-flat.glb', position: { x: 0, y: 0, z: -2 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/van.glb', position: { x: -2, y: 0, z: -2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/delivery.glb', position: { x: -4, y: 0, z: -2 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/truck-flat.glb', position: { x: -6, y: 0, z: -2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      
      // z=4: Troisième couche
      { model: '/models/truck-flat.glb', position: { x: 4, y: 0, z: 4 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/van.glb', position: { x: 2, y: 0, z: 4 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/delivery.glb', position: { x: 0, y: 0, z: 4 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/truck-flat.glb', position: { x: -2, y: 0, z: 4 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/van.glb', position: { x: -4, y: 0, z: 4 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      
      // z=-4: Quatrième couche
      { model: '/models/delivery.glb', position: { x: 4, y: 0, z: -4 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/truck-flat.glb', position: { x: 2, y: 0, z: -4 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/van.glb', position: { x: 0, y: 0, z: -4 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/delivery.glb', position: { x: -2, y: 0, z: -4 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/truck-flat.glb', position: { x: -4, y: 0, z: -4 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      
      // ========== ÉTAGE -1 - IDENTIQUE ==========
      { model: '/models/van.glb', position: { x: 2, y: -3, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/truck-flat.glb', position: { x: 0, y: -3, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/delivery.glb', position: { x: -2, y: -3, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/van.glb', position: { x: -4, y: -3, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      
      { model: '/models/truck-flat.glb', position: { x: 4, y: -3, z: 2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/delivery.glb', position: { x: 2, y: -3, z: 2 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/van.glb', position: { x: 0, y: -3, z: 2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/truck-flat.glb', position: { x: -2, y: -3, z: 2 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/delivery.glb', position: { x: -4, y: -3, z: 2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      
      { model: '/models/van.glb', position: { x: 4, y: -3, z: -2 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/truck-flat.glb', position: { x: 2, y: -3, z: -2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/delivery.glb', position: { x: 0, y: -3, z: -2 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/van.glb', position: { x: -2, y: -3, z: -2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/truck-flat.glb', position: { x: -4, y: -3, z: -2 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      
      { model: '/models/delivery.glb', position: { x: 4, y: -3, z: 4 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/van.glb', position: { x: 0, y: -3, z: 4 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/truck-flat.glb', position: { x: -4, y: -3, z: 4 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      
      { model: '/models/delivery.glb', position: { x: 2, y: -3, z: -4 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/van.glb', position: { x: -2, y: -3, z: -4 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      
      // ========== ÉTAGE -2 - BOSS FINAL ==========
      { model: '/models/truck-flat.glb', position: { x: -6, y: -6, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/van.glb', position: { x: -4, y: -6, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/delivery.glb', position: { x: -2, y: -6, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/truck-flat.glb', position: { x: 0, y: -6, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      
      { model: '/models/van.glb', position: { x: -6, y: -6, z: 2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/delivery.glb', position: { x: -4, y: -6, z: 2 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/truck-flat.glb', position: { x: -2, y: -6, z: 2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/van.glb', position: { x: 0, y: -6, z: 2 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      
      { model: '/models/delivery.glb', position: { x: -6, y: -6, z: -2 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/truck-flat.glb', position: { x: -4, y: -6, z: -2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/van.glb', position: { x: -2, y: -6, z: -2 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/delivery.glb', position: { x: 0, y: -6, z: -2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      
      { model: '/models/truck-flat.glb', position: { x: -6, y: -6, z: 4 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/van.glb', position: { x: -2, y: -6, z: 4 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      
      { model: '/models/delivery.glb', position: { x: -4, y: -6, z: -4 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/truck-flat.glb', position: { x: 0, y: -6, z: -4 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 }
    ],
    // 96 mouvements
    solution: [
      { vehicle: 11, dir: 'down' },
      { vehicle: 5, dir: 'down' },
      { vehicle: 5, dir: 'up' },
      { vehicle: 11, dir: 'down' },
      { vehicle: 10, dir: 'left' },
      { vehicle: 10, dir: 'left' },
      { vehicle: 4, dir: 'down' },
      { vehicle: 5, dir: 'down' },
      { vehicle: 16, dir: 'down' },
      { vehicle: 17, dir: 'right' },
      { vehicle: 17, dir: 'left' },
      { vehicle: 17, dir: 'left' },
      { vehicle: 15, dir: 'left' },
      { vehicle: 15, dir: 'left' },
      { vehicle: 3, dir: 'up' },
      { vehicle: 9, dir: 'up' },
      { vehicle: 8, dir: 'left' },
      { vehicle: 2, dir: 'down' },
      { vehicle: 14, dir: 'down' },
      { vehicle: 27, dir: 'down' },
      { vehicle: 26, dir: 'left' },
      { vehicle: 26, dir: 'left' },
      { vehicle: 27, dir: 'up' },
      { vehicle: 3, dir: 'up' },
      { vehicle: 9, dir: 'up' },
      { vehicle: 14, dir: 'up' },
      { vehicle: 16, dir: 'up' },
      { vehicle: 14, dir: 'down' },
      { vehicle: 13, dir: 'left' },
      { vehicle: 1, dir: 'up' },
      { vehicle: 7, dir: 'up' },
      { vehicle: 19, dir: 'up' },
      { vehicle: 20, dir: 'right' },
      { vehicle: 2, dir: 'down' },
      { vehicle: 14, dir: 'down' },
      { vehicle: 9, dir: 'down' },
      { vehicle: 13, dir: 'left' },
      { vehicle: 14, dir: 'up' },
      { vehicle: 5, dir: 'up' },
      { vehicle: 11, dir: 'up' },
      { vehicle: 22, dir: 'left' },
      { vehicle: 22, dir: 'left' },
      { vehicle: 11, dir: 'down' },
      { vehicle: 5, dir: 'down' },
      { vehicle: 4, dir: 'down' },
      { vehicle: 8, dir: 'left' },
      { vehicle: 9, dir: 'down' },
      { vehicle: 21, dir: 'up' },
      { vehicle: 20, dir: 'left' },
      { vehicle: 2, dir: 'down' },
      { vehicle: 14, dir: 'down' },
      { vehicle: 14, dir: 'down' },
      { vehicle: 13, dir: 'left' },
      { vehicle: 1, dir: 'up' },
      { vehicle: 0, dir: 'left' },
      { vehicle: 0, dir: 'left' },
      { vehicle: 0, dir: 'left' },
      { vehicle: 0, dir: 'left' },
      { vehicle: 0, dir: 'left' },
      { vehicle: 0, dir: 'left' },
      { vehicle: 0, dir: 'elevator-down' },
      { vehicle: 36, dir: 'left' },
      { vehicle: 31, dir: 'down' },
      { vehicle: 41, dir: 'up' },
      { vehicle: 40, dir: 'left' },
      { vehicle: 40, dir: 'left' },
      { vehicle: 30, dir: 'up' },
      { vehicle: 39, dir: 'up' },
      { vehicle: 37, dir: 'up' },
      { vehicle: 38, dir: 'right' },
      { vehicle: 28, dir: 'up' },
      { vehicle: 29, dir: 'up' },
      { vehicle: 0, dir: 'right' },
      { vehicle: 0, dir: 'right' },
      { vehicle: 0, dir: 'right' },
      { vehicle: 0, dir: 'right' },
      { vehicle: 0, dir: 'right' },
      { vehicle: 0, dir: 'right' },
      { vehicle: 0, dir: 'elevator-down' },
      { vehicle: 58, dir: 'right' },
      { vehicle: 50, dir: 'up' },
      { vehicle: 54, dir: 'down' },
      { vehicle: 53, dir: 'right' },
      { vehicle: 49, dir: 'down' },
      { vehicle: 59, dir: 'right' },
      { vehicle: 52, dir: 'down' },
      { vehicle: 48, dir: 'down' },
      { vehicle: 0, dir: 'left' },
      { vehicle: 0, dir: 'left' },
      { vehicle: 0, dir: 'left' },
      { vehicle: 0, dir: 'left' },
      { vehicle: 51, dir: 'left' },
      { vehicle: 47, dir: 'down' },
      { vehicle: 0, dir: 'left' },
      { vehicle: 0, dir: 'left' }
    ]
  }
}

/**
 * LevelManager - Gère le chargement et la configuration des niveaux
 */
export class LevelManager {
  constructor() {
    this.currentLevel = 1
    this.unlockedLevels = this.loadProgress()
  }

  getLevel(levelNum) {
    return LEVELS[levelNum] || LEVELS[1]
  }

  getCurrentLevel() {
    return this.getLevel(this.currentLevel)
  }

  setLevel(levelNum) {
    if (LEVELS[levelNum]) {
      this.currentLevel = levelNum
      return true
    }
    return false
  }

  nextLevel() {
    const next = this.currentLevel + 1
    if (LEVELS[next]) {
      this.currentLevel = next
      this.unlockLevel(next)
      return true
    }
    return false
  }

  unlockLevel(levelNum) {
    if (!this.unlockedLevels.includes(levelNum)) {
      this.unlockedLevels.push(levelNum)
      this.saveProgress()
    }
  }

  isLevelUnlocked(levelNum) {
    return levelNum === 1 || this.unlockedLevels.includes(levelNum)
  }

  getLevelCount() {
    return Object.keys(LEVELS).length
  }

  saveProgress() {
    localStorage.setItem('parkingJam_unlockedLevels', JSON.stringify(this.unlockedLevels))
  }

  loadProgress() {
    try {
      const saved = localStorage.getItem('parkingJam_unlockedLevels')
      return saved ? JSON.parse(saved) : [1]
    } catch {
      return [1]
    }
  }
}
