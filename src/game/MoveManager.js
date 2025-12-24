export class MoveManager {
  constructor() {
    this.history = []
  }
  
  addMove(vehicle, fromX, fromZ, toX, toZ) {
    this.history.push({
      vehicle,
      from: { x: fromX, z: fromZ },
      to: { x: toX, z: toZ }
    })
  }
  
  undo() {
    if (this.history.length === 0) return null
    
    const lastMove = this.history.pop()
    // Repositionner le véhicule à sa position d'origine
    lastMove.vehicle.moveTo(lastMove.from.x, lastMove.from.z)
    
    return lastMove
  }
  
  canUndo() {
    return this.history.length > 0
  }
  
  clear() {
    this.history = []
  }
}
