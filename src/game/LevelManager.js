import * as THREE from 'three'
import { DIRECTIONS, FLOORS } from '../utils/constants.js'

/**
 * PARKING JAM 3D - PUZZLES RÉSOLUBLES
 * 
 * RÈGLES DE CONCEPTION :
 * 1. Taxi HORIZONTAL sur z=0 → va vers la gauche (x négatif)
 * 2. Obstacles sur z=0 = VERTICAUX (pour pouvoir les dégager)
 * 3. Les verticaux doivent avoir de l'ESPACE pour bouger (haut ou bas)
 * 4. Ne JAMAIS saturer toutes les lignes !
 * 
 * Ascenseurs sur z=0, taxi sur z=0
 */
export const LEVELS = {
  // ============================================
  // NIVEAU 1 - TUTORIEL (apprendre à déplacer)
  // Solution : déplacer les 3 vans vers le haut ou bas
  // ============================================
  1: {
    name: 'Niveau 1 - Tutoriel',
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
      // ========== ÉTAGE 0 ==========
      // 3 véhicules VERTICAUX bloquant le passage - peuvent monter ou descendre
      { model: '/models/van.glb', position: { x: 2, y: 0, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/delivery.glb', position: { x: 0, y: 0, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/truck-flat.glb', position: { x: -2, y: 0, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      // PAS de blocage sur z=-2 et z=2 → les verticaux peuvent se dégager !
      
      // ========== ÉTAGE -1 ==========
      // Même principe : verticaux avec espace pour bouger
      { model: '/models/delivery.glb', position: { x: 2, y: -3, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/van.glb', position: { x: 0, y: -3, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      
      // ========== ÉTAGE -2 (sortie) ==========
      // Blocage devant la sortie - doit pouvoir se dégager
      { model: '/models/truck-flat.glb', position: { x: -6, y: -6, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/van.glb', position: { x: -4, y: -6, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 }
    ]
  },

  // ============================================
  // NIVEAU 2 - INTERMÉDIAIRE (chaînes courtes)
  // Certains verticaux sont bloqués par des horizontaux
  // qu'il faut d'abord déplacer
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
      // ========== ÉTAGE 0 ==========
      // Verticaux sur z=0
      { model: '/models/truck-flat.glb', position: { x: 2, y: 0, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/van.glb', position: { x: 0, y: 0, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/delivery.glb', position: { x: -2, y: 0, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/van.glb', position: { x: -4, y: 0, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      
      // Horizontaux sur z=-2 (bloquent certains verticaux vers le haut)
      // MAIS il y a des trous ! Le van en x=0 peut monter car x=0,z=-2 est LIBRE
      { model: '/models/van.glb', position: { x: 2, y: 0, z: -2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/delivery.glb', position: { x: -2, y: 0, z: -2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      // x=0,z=-2 LIBRE ! et x=-4,z=-2 LIBRE !
      
      // Horizontaux sur z=2 (bloquent certains verticaux vers le bas)
      { model: '/models/truck-flat.glb', position: { x: 0, y: 0, z: 2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/van.glb', position: { x: -4, y: 0, z: 2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      // x=2,z=2 LIBRE ! et x=-2,z=2 LIBRE !
      
      // ========== ÉTAGE -1 ==========
      { model: '/models/van.glb', position: { x: 2, y: -3, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/truck-flat.glb', position: { x: 0, y: -3, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/delivery.glb', position: { x: -2, y: -3, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      // Blocage partiel
      { model: '/models/van.glb', position: { x: 2, y: -3, z: -2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/van.glb', position: { x: 0, y: -3, z: 2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      
      // ========== ÉTAGE -2 ==========
      { model: '/models/delivery.glb', position: { x: -6, y: -6, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/van.glb', position: { x: -4, y: -6, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/truck-flat.glb', position: { x: -2, y: -6, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      // Blocage partiel
      { model: '/models/van.glb', position: { x: -4, y: -6, z: -2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      // x=-6,z=-2 LIBRE, x=-2,z=-2 LIBRE, z=2 entièrement LIBRE
    ]
  },

  // ============================================
  // NIVEAU 3 - EXPERT (chaînes longues)
  // Il faut résoudre dans le bon ordre !
  // Plus de véhicules mais toujours des espaces
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
      // ========== ÉTAGE 0 - DENSE MAIS RÉSOLUBLE ==========
      // Verticaux sur z=0
      { model: '/models/van.glb', position: { x: 2, y: 0, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/delivery.glb', position: { x: 0, y: 0, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/truck-flat.glb', position: { x: -2, y: 0, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/van.glb', position: { x: -4, y: 0, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/delivery.glb', position: { x: -6, y: 0, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      
      // z=-2 : blocage PARTIEL (certains peuvent quand même monter)
      { model: '/models/truck-flat.glb', position: { x: 2, y: 0, z: -2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/van.glb', position: { x: -2, y: 0, z: -2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      // x=0, x=-4, x=-6 sur z=-2 sont LIBRES
      
      // z=2 : blocage PARTIEL
      { model: '/models/delivery.glb', position: { x: 0, y: 0, z: 2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/van.glb', position: { x: -4, y: 0, z: 2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      // x=2, x=-2, x=-6 sur z=2 sont LIBRES
      
      // z=-4 : quelques verrous (mais horizontaux peuvent bouger)
      { model: '/models/van.glb', position: { x: 2, y: 0, z: -4 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/truck-flat.glb', position: { x: -2, y: 0, z: -4 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      
      // z=4 : quelques verrous
      { model: '/models/delivery.glb', position: { x: 0, y: 0, z: 4 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/van.glb', position: { x: -4, y: 0, z: 4 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      
      // ========== ÉTAGE -1 - COMPLEXE ==========
      // Verticaux sur z=0
      { model: '/models/truck-flat.glb', position: { x: 2, y: -3, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/van.glb', position: { x: 0, y: -3, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/delivery.glb', position: { x: -2, y: -3, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/truck-flat.glb', position: { x: -4, y: -3, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      
      // z=-2 : blocage partiel
      { model: '/models/van.glb', position: { x: 2, y: -3, z: -2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/delivery.glb', position: { x: -2, y: -3, z: -2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      // x=0, x=-4 LIBRES
      
      // z=2 : blocage partiel
      { model: '/models/truck-flat.glb', position: { x: 0, y: -3, z: 2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/van.glb', position: { x: -4, y: -3, z: 2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      // x=2, x=-2 LIBRES
      
      // Verrous
      { model: '/models/delivery.glb', position: { x: 2, y: -3, z: -4 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/van.glb', position: { x: 0, y: -3, z: 4 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      
      // ========== ÉTAGE -2 - SORTIE ==========
      // Verticaux devant la sortie
      { model: '/models/van.glb', position: { x: -6, y: -6, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/delivery.glb', position: { x: -4, y: -6, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/truck-flat.glb', position: { x: -2, y: -6, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/van.glb', position: { x: 0, y: -6, z: 0 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      
      // Blocage partiel
      { model: '/models/delivery.glb', position: { x: -4, y: -6, z: -2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/van.glb', position: { x: 0, y: -6, z: -2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      // x=-6, x=-2 sur z=-2 LIBRES
      
      { model: '/models/truck-flat.glb', position: { x: -6, y: -6, z: 2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      { model: '/models/van.glb', position: { x: -2, y: -6, z: 2 }, direction: DIRECTIONS.HORIZONTAL, rotation: Math.PI / 2 },
      // x=-4, x=0 sur z=2 LIBRES
      
      // Verrous
      { model: '/models/delivery.glb', position: { x: -4, y: -6, z: -4 }, direction: DIRECTIONS.VERTICAL, rotation: 0 },
      { model: '/models/van.glb', position: { x: -6, y: -6, z: 4 }, direction: DIRECTIONS.VERTICAL, rotation: 0 }
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
