import * as THREE from 'three'
import { GRID_SIZE, PARKING_BOUNDS, DIRECTIONS } from '../utils/constants.js'

export class InputController {
  constructor(camera, vehicleManager, collisionManager, elevators = [], onMove = null) {
    this.camera = camera
    this.vehicleManager = vehicleManager
    this.collisionManager = collisionManager
    this.elevators = elevators
    this.onMove = onMove  // Callback quand un mouvement est effectué
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
    
    // Gestion ascenseur
    if (event.key === 'e' || event.key === 'E') {
      // Descendre d'un étage
      const elevator = this.elevators.find(e => e.isVehicleOnElevator(currentPos))
      if (elevator && elevator.canGoDown()) {
        const newFloorIndex = elevator.moveVehicleToFloorBelow(this.selectedVehicle)
        if (newFloorIndex !== null) {
          console.log(`Descente vers l'étage ${newFloorIndex}`)
        }
      }
      return
    }
    
    if (event.key === 'q' || event.key === 'Q') {
      // Monter d'un étage
      const elevator = this.elevators.find(e => e.isVehicleOnElevator(currentPos))
      if (elevator && elevator.canGoUp()) {
        const newFloorIndex = elevator.moveVehicleToFloorAbove(this.selectedVehicle)
        if (newFloorIndex !== null) {
          console.log(`Montée vers l'étage ${newFloorIndex}`)
        }
      }
      return
    }
    
    // Déplacement basé sur la direction autorisée du véhicule
    // Parking Jam : chaque véhicule ne peut aller que sur UN axe
    switch(event.key) {
      case 'ArrowUp':
      case 'z':
        if (direction === DIRECTIONS.VERTICAL) {
          targetZ -= GRID_SIZE  // Vers le haut (-Z)
          moveDirection = 'vertical'
        }
        break
      case 'ArrowDown':
      case 's':
        if (direction === DIRECTIONS.VERTICAL) {
          targetZ += GRID_SIZE  // Vers le bas (+Z)
          moveDirection = 'vertical'
        }
        break
      case 'ArrowLeft':
      case 'a':
        if (direction === DIRECTIONS.HORIZONTAL) {
          targetX -= GRID_SIZE  // Vers la gauche (-X)
          moveDirection = 'horizontal'
        }
        break
      case 'ArrowRight':
      case 'd':
        if (direction === DIRECTIONS.HORIZONTAL) {
          targetX += GRID_SIZE  // Vers la droite (+X)
          moveDirection = 'horizontal'
        }
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
    
    // Notifier le scoring
    if (this.onMove) {
      this.onMove()
    }
  }
}
