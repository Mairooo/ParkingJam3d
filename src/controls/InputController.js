import * as THREE from 'three'
import { GRID_SIZE, PARKING_BOUNDS, DIRECTIONS } from '../utils/constants.js'

export class InputController {
  constructor(camera, vehicleManager, collisionManager) {
    this.camera = camera
    this.vehicleManager = vehicleManager
    this.collisionManager = collisionManager
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()
    this.selectedVehicle = null
    
    this.setupEventListeners()
  }
  
  setupEventListeners() {
    window.addEventListener('mousemove', (e) => this.onMouseMove(e))
    window.addEventListener('click', (e) => this.onMouseClick(e))
    window.addEventListener('keydown', (e) => this.onKeyDown(e))
  }
  
  onMouseMove(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
  }
  
  onMouseClick(event) {
    this.raycaster.setFromCamera(this.mouse, this.camera)
    const intersects = this.raycaster.intersectObjects(
      this.vehicleManager.vehicles.map(v => v.model), 
      true
    )
    
    // Désélectionner le véhicule précédent
    if (this.selectedVehicle) {
      this.selectedVehicle.deselect()
    }
    
    this.selectedVehicle = null
    
    // Chercher un véhicule cliqué
    if (intersects.length > 0) {
      const vehicle = this.vehicleManager.getVehicleFromObject(intersects[0].object)
      if (vehicle) {
        this.selectedVehicle = vehicle
        vehicle.select()
        // Vehicule selectionne
      }
    }
  }
  
  onKeyDown(event) {
    if (!this.selectedVehicle) return
    
    const currentPos = this.selectedVehicle.getPosition()
    const direction = this.selectedVehicle.direction
    let targetX = currentPos.x
    let targetZ = currentPos.z
    let moveDirection = null
    
    // Calculer le vecteur avant du véhicule basé sur sa rotation
    const rotation = this.selectedVehicle.model.rotation.y
    const forward = new THREE.Vector3(
      Math.sin(rotation),
      0,
      Math.cos(rotation)
    )
    
    // Déplacement: le véhicule avance/recule dans la direction de son orientation 3D
    switch(event.key) {
      case 'ArrowUp':
      case 'z':
        // Avancer dans la direction du véhicule
        targetX += forward.x * GRID_SIZE
        targetZ += forward.z * GRID_SIZE
        moveDirection = direction
        break
      case 'ArrowDown':
      case 's':
        // Reculer (direction opposée)
        targetX -= forward.x * GRID_SIZE
        targetZ -= forward.z * GRID_SIZE
        moveDirection = direction
        break
      default:
        return
    }
    
    // Arrondir pour rester sur la grille
    targetX = Math.round(targetX / GRID_SIZE) * GRID_SIZE
    targetZ = Math.round(targetZ / GRID_SIZE) * GRID_SIZE
    
    // Si aucun mouvement défini
    if (!moveDirection) {
      return
    }
    
    // Vérifier les limites
    if (!this.collisionManager.isWithinBounds(targetX, targetZ, PARKING_BOUNDS)) {
      // Deplacement hors limites
      this.selectedVehicle.flashCollision()
      return
    }
    
    // Vérifier les collisions
    if (this.collisionManager.checkCollision(this.selectedVehicle, targetX, targetZ)) {
      // Collision avec un autre vehicule
      this.selectedVehicle.flashCollision()
      return
    }
    
    // Déplacement valide
    this.selectedVehicle.moveTo(targetX, targetZ)
    // Deplacement vers position cible
  }
}
