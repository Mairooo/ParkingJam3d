import * as THREE from 'three'
import { GRID_SIZE, MOVE_SPEED, DIRECTIONS } from '../utils/constants.js'

export class Vehicle {
  constructor(model, position, direction = DIRECTIONS.BOTH, color = null) {
    this.model = model
    this.direction = direction
    this.isSelected = false
    
    // Configuration du modèle
    this.model.position.copy(position)
    this.model.userData.isVehicle = true
    this.model.userData.vehicleInstance = this
    this.model.userData.direction = direction
    
  }
  
  setColor(color) {
    this.model.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.color.set(color)
      }
    })
  }
  
  select() {
    this.isSelected = true
    this.model.traverse((child) => {
      if (child.isMesh && child.material.emissive) {
        child.material.emissive.setHex(0x00ff00)
      }
    })
  }
  
  deselect() {
    this.isSelected = false
    this.model.traverse((child) => {
      if (child.isMesh && child.material.emissive) {
        child.material.emissive.setHex(0x000000)
      }
    })
  }
  
  hover() {
    if (this.isSelected) return  // Ne pas hover si déjà sélectionné
    this.model.traverse((child) => {
      if (child.isMesh && child.material.emissive) {
        child.material.emissive.setHex(0x444444)  // Gris clair au survol
      }
    })
  }
  
  unhover() {
    if (this.isSelected) return  // Ne pas unhover si sélectionné
    this.model.traverse((child) => {
      if (child.isMesh && child.material.emissive) {
        child.material.emissive.setHex(0x000000)
      }
    })
  }
  
  flashCollision() {
    this.model.traverse((child) => {
      if (child.isMesh && child.material.emissive) {
        child.material.emissive.setHex(0xff0000)
        setTimeout(() => {
          if (this.isSelected) {
            child.material.emissive.setHex(0x00ff00)
          }
        }, 200)
      }
    })
  }
  
  canMove(direction) {
    if (this.direction === DIRECTIONS.BOTH) return true
    if (direction === 'horizontal' && this.direction === DIRECTIONS.HORIZONTAL) return true
    if (direction === 'vertical' && this.direction === DIRECTIONS.VERTICAL) return true
    return false
  }
  
  moveTo(targetX, targetZ) {
    this.model.userData.targetX = targetX
    this.model.userData.targetZ = targetZ
  }
  
  update() {
    // Interpolation fluide vers la position cible
    if (this.model.userData.targetX !== undefined) {
      this.model.position.x += (this.model.userData.targetX - this.model.position.x) * MOVE_SPEED
      if (Math.abs(this.model.userData.targetX - this.model.position.x) < 0.01) {
        this.model.position.x = this.model.userData.targetX
        this.model.userData.targetX = undefined
      }
    }
    if (this.model.userData.targetZ !== undefined) {
      this.model.position.z += (this.model.userData.targetZ - this.model.position.z) * MOVE_SPEED
      if (Math.abs(this.model.userData.targetZ - this.model.position.z) < 0.01) {
        this.model.position.z = this.model.userData.targetZ
        this.model.userData.targetZ = undefined
      }
    }
  }
  
  getPosition() {
    return {
      x: this.model.position.x,
      y: this.model.position.y,
      z: this.model.position.z
    }
  }
  
  isMoving() {
    return this.model.userData.targetX !== undefined || 
           this.model.userData.targetZ !== undefined
  }
}
