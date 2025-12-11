import { GRID_SIZE } from '../utils/constants.js'

export class CollisionManager {
  constructor(vehicleManager) {
    this.vehicleManager = vehicleManager
  }
  
  checkCollision(vehicle, targetX, targetZ) {
    const vehicles = this.vehicleManager.getAllVehicles()
    const vehicleY = vehicle.getPosition().y
    
    for (const otherVehicle of vehicles) {
      if (otherVehicle === vehicle) continue
      
      const otherPos = otherVehicle.getPosition()
      
      // Vérifie que les véhicules sont sur le même niveau (même Y)
      if (Math.abs(otherPos.y - vehicleY) > 0.5) continue
      
      // Collision simple : même case de grille
      if (Math.abs(otherPos.x - targetX) < GRID_SIZE * 0.5 && 
          Math.abs(otherPos.z - targetZ) < GRID_SIZE * 0.5) {
        return true
      }
    }
    
    return false
  }
  
  isWithinBounds(x, z, bounds) {
    return x >= bounds.min && x <= bounds.max && 
           z >= bounds.min && z <= bounds.max
  }
}
