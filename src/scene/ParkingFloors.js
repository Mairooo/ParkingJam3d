import * as THREE from 'three'
import { COLORS, FLOORS } from '../utils/constants.js'

export class ParkingFloors {
  constructor(scene) {
    this.scene = scene
    this.floors = []
    this.pillars = []
    this.createFloors()
    this.createPillars()
  }
  
  createFloors() {
    FLOORS.forEach((floorData, index) => {
      // Sol de l'étage
      const floorGeometry = new THREE.PlaneGeometry(20, 20)
      const floorMaterial = new THREE.MeshStandardMaterial({ 
        color: index === 0 ? COLORS.floor : (index === 1 ? COLORS.floorLevel1 : COLORS.floorLevel2),
        roughness: 0.8,
        metalness: 0.2
      })
      const floor = new THREE.Mesh(floorGeometry, floorMaterial)
      floor.rotation.x = -Math.PI / 2
      floor.position.y = floorData.y
      floor.receiveShadow = true
      floor.userData.floorLevel = floorData.level
      this.scene.add(floor)
      
      // Grille de repères pour chaque étage
      const gridHelper = new THREE.GridHelper(20, 20, COLORS.grid, COLORS.gridCenter)
      gridHelper.position.y = floorData.y + 0.01
      this.scene.add(gridHelper)
      
      this.floors.push({ mesh: floor, data: floorData })
    })
  }
  
  createPillars() {
    // Créer des piliers aux 4 coins pour visualiser la structure
    const pillarGeometry = new THREE.CylinderGeometry(0.3, 0.3, 12, 8)
    const pillarMaterial = new THREE.MeshStandardMaterial({ 
      color: COLORS.pillar,
      roughness: 0.6,
      metalness: 0.4
    })
    
    const positions = [
      { x: -9, z: -9 },
      { x: 9, z: -9 },
      { x: -9, z: 9 },
      { x: 9, z: 9 }
    ]
    
    positions.forEach(pos => {
      const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial)
      pillar.position.set(pos.x, -4, pos.z) // Centré entre les étages
      pillar.castShadow = true
      pillar.receiveShadow = true
      this.scene.add(pillar)
      this.pillars.push(pillar)
    })
  }
  
  getFloorYByLevel(level) {
    const floor = FLOORS.find(f => f.level === level)
    return floor ? floor.y : 0
  }
}
