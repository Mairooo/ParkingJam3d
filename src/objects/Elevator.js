import * as THREE from 'three'
import { GRID_SIZE, COLORS, FLOORS } from '../utils/constants.js'

export class Elevator {
  constructor(scene, x, z, floorIndex) {
    this.scene = scene
    this.x = x
    this.z = z
    this.floorIndex = floorIndex  // L'étage fixe de cet ascenseur
    this.y = FLOORS[floorIndex].y
    this.mesh = null
    this.createElevator()
  }
  
  createElevator() {
    // Plateforme d'ascenseur
    const geometry = new THREE.BoxGeometry(GRID_SIZE * 1.5, 0.3, GRID_SIZE * 1.5)
    const material = new THREE.MeshStandardMaterial({ 
      color: COLORS.elevator,
      roughness: 0.3,
      metalness: 0.7,
      emissive: COLORS.elevator,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.9
    })
    
    this.mesh = new THREE.Mesh(geometry, material)
    this.mesh.position.set(this.x, this.y + 0.15, this.z)
    this.mesh.castShadow = true
    this.mesh.receiveShadow = true
    this.mesh.userData.isElevator = true
    this.mesh.userData.elevatorInstance = this
    
    // Animation de pulsation
    this.animationTime = 0
    
    this.scene.add(this.mesh)
  }
  
  isVehicleOnElevator(vehiclePos) {
    return Math.abs(vehiclePos.x - this.x) < GRID_SIZE * 0.6 &&
           Math.abs(vehiclePos.z - this.z) < GRID_SIZE * 0.6 &&
           Math.abs(vehiclePos.y - this.y) < 0.5
  }
  
  getFloorIndex() {
    return this.floorIndex
  }
  
  canGoDown() {
    return this.floorIndex < FLOORS.length - 1
  }
  
  canGoUp() {
    return this.floorIndex > 0
  }
  
  // Déplace un véhicule vers l'étage du dessous
  moveVehicleToFloorBelow(vehicle) {
    if (!this.canGoDown()) return null
    
    const targetFloorIndex = this.floorIndex + 1
    const newY = FLOORS[targetFloorIndex].y
    vehicle.model.position.y = newY
    return targetFloorIndex
  }
  
  // Déplace un véhicule vers l'étage du dessus
  moveVehicleToFloorAbove(vehicle) {
    if (!this.canGoUp()) return null
    
    const targetFloorIndex = this.floorIndex - 1
    const newY = FLOORS[targetFloorIndex].y
    vehicle.model.position.y = newY
    return targetFloorIndex
  }
  
  update(deltaTime = 0.016) {
    // Animation de pulsation
    this.animationTime += deltaTime
    const pulse = Math.sin(this.animationTime * 2) * 0.2 + 0.3
    this.mesh.material.emissiveIntensity = pulse
  }
}
