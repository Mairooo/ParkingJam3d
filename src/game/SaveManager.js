export class SaveManager {
  constructor(storageKey = 'parkingJam3D') {
    this.storageKey = storageKey
    this.autoSaveEnabled = true
  }
  
  // ========== SAUVEGARDE ==========
  
  save(gameState) {
    try {
      const saveData = {
        ...gameState,
        timestamp: Date.now(),
        version: '1.0'
      }
      localStorage.setItem(this.storageKey, JSON.stringify(saveData))
      console.log('Partie sauvegardée')
      return true
    } catch (error) {
      console.error('Erreur de sauvegarde:', error)
      return false
    }
  }
  
  // Sauvegarde l'état des véhicules
  saveGameState(vehicleManager, scoreManager, moveHistory = []) {
    const vehicles = vehicleManager.getAllVehicles()
    
    const vehicleStates = vehicles.map((vehicle, index) => {
      const pos = vehicle.getPosition()
      return {
        index,
        x: pos.x,
        y: pos.y,
        z: pos.z,
        direction: vehicle.direction,
        isPlayer: vehicle.isPlayer || false
      }
    })
    
    const gameState = {
      vehicles: vehicleStates,
      moves: scoreManager.moves,
      elapsedTime: scoreManager.elapsedTime,
      isRunning: scoreManager.isRunning,
      moveHistoryCount: moveHistory.length
    }
    
    return this.save(gameState)
  }
  
  // ========== CHARGEMENT ==========
  
  load() {
    try {
      const data = localStorage.getItem(this.storageKey)
      if (!data) {
        console.log('Aucune sauvegarde trouvée')
        return null
      }
      
      const saveData = JSON.parse(data)
      console.log('Sauvegarde chargée:', saveData.timestamp ? new Date(saveData.timestamp).toLocaleString() : 'N/A')
      return saveData
    } catch (error) {
      console.error('Erreur de chargement:', error)
      return null
    }
  }
  
  // Restaure l'état des véhicules
  restoreGameState(vehicleManager, scoreManager, savedState) {
    if (!savedState || !savedState.vehicles) return false
    
    const vehicles = vehicleManager.getAllVehicles()
    
    // Restaurer les positions des véhicules
    savedState.vehicles.forEach((state) => {
      if (vehicles[state.index]) {
        const vehicle = vehicles[state.index]
        vehicle.model.position.set(state.x, state.y, state.z)
      }
    })
    
    // Restaurer le score
    if (savedState.moves !== undefined) {
      scoreManager.moves = savedState.moves
      scoreManager.elapsedTime = savedState.elapsedTime || 0
      scoreManager.updateDisplay()
      
      // Redémarrer le timer si le jeu était en cours
      if (savedState.isRunning && savedState.moves > 0) {
        scoreManager.isRunning = true
        scoreManager.startTime = Date.now() - (savedState.elapsedTime * 1000)
        scoreManager.timerInterval = setInterval(() => {
          scoreManager.elapsedTime = Math.floor((Date.now() - scoreManager.startTime) / 1000)
          scoreManager.updateTimerDisplay()
        }, 1000)
      }
    }
    
    console.log('État du jeu restauré')
    return true
  }
  
  // ========== MEILLEUR SCORE ==========
  
  saveBestScore(moves, time) {
    const bestScoreKey = `${this.storageKey}_best`
    const currentBest = this.getBestScore()
    
    // Moins de mouvements = meilleur, ou même mouvements mais moins de temps
    if (!currentBest || moves < currentBest.moves || 
        (moves === currentBest.moves && time < currentBest.time)) {
      const bestScore = { moves, time, date: Date.now() }
      localStorage.setItem(bestScoreKey, JSON.stringify(bestScore))
      console.log('Nouveau meilleur score!')
      return true
    }
    return false
  }
  
  getBestScore() {
    try {
      const data = localStorage.getItem(`${this.storageKey}_best`)
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  }
  
  // ========== UTILITAIRES ==========
  
  hasSave() {
    return localStorage.getItem(this.storageKey) !== null
  }
  
  clearSave() {
    localStorage.removeItem(this.storageKey)
    console.log('Sauvegarde effacée')
  }
  
  clearAll() {
    localStorage.removeItem(this.storageKey)
    localStorage.removeItem(`${this.storageKey}_best`)
    console.log('Toutes les données effacées')
  }
  
  // Auto-save toggle
  setAutoSave(enabled) {
    this.autoSaveEnabled = enabled
    console.log(`Auto-save: ${enabled ? 'activé' : 'désactivé'}`)
  }
}
