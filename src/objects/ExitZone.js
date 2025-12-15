import * as THREE from 'three'
import { GRID_SIZE, COLORS } from '../utils/constants.js'

export class ExitZone {
  constructor(scene, x, z, y = 0) {
    this.scene = scene
    this.position = { x, y, z }
    this.mesh = null
    this.createZone()
  }
  
  createZone() {
    // Zone de sortie visuelle
    const geometry = new THREE.BoxGeometry(GRID_SIZE * 1.2, 0.3, GRID_SIZE * 1.2)
    const material = new THREE.MeshStandardMaterial({ 
      color: COLORS.exitZone,
      roughness: 0.4,
      metalness: 0.6,
      emissive: COLORS.exitZone,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.8
    })
    
    this.mesh = new THREE.Mesh(geometry, material)
    this.mesh.position.set(this.position.x, this.position.y + 0.15, this.position.z)
    this.mesh.userData.isExitZone = true
    
    // Animation de pulsation
    this.animationTime = 0
    
    this.scene.add(this.mesh)
  }
  
  isVehicleInZone(vehiclePos) {
    return Math.abs(vehiclePos.x - this.position.x) < GRID_SIZE * 0.5 &&
           Math.abs(vehiclePos.z - this.position.z) < GRID_SIZE * 0.5 &&
           Math.abs(vehiclePos.y - this.position.y) < 0.5
  }
  
  update(deltaTime = 0.016) {
    // Animation de pulsation
    this.animationTime += deltaTime
    const pulse = Math.sin(this.animationTime * 3) * 0.2 + 0.3
    this.mesh.material.emissiveIntensity = pulse
  }
}
