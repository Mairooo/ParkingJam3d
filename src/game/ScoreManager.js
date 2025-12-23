export class ScoreManager {
  constructor() {
    this.moves = 0
    this.startTime = null
    this.elapsedTime = 0
    this.isRunning = false
    this.timerInterval = null
    
    this.createUI()
  }
  
  createUI() {
    // Container principal
    this.container = document.createElement('div')
    this.container.id = 'score-container'
    this.container.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 15px 25px;
      border-radius: 10px;
      font-family: 'Segoe UI', Arial, sans-serif;
      font-size: 16px;
      z-index: 100;
      min-width: 150px;
    `
    
    // Affichage mouvements
    this.movesDisplay = document.createElement('div')
    this.movesDisplay.innerHTML = 'Mouvements: <span id="moves-count">0</span>'
    this.movesDisplay.style.marginBottom = '8px'
    
    // Affichage timer
    this.timerDisplay = document.createElement('div')
    this.timerDisplay.innerHTML = 'Temps: <span id="timer">00:00</span>'
    
    this.container.appendChild(this.movesDisplay)
    this.container.appendChild(this.timerDisplay)
    document.body.appendChild(this.container)
  }
  
  start() {
    if (this.isRunning) return
    
    this.isRunning = true
    this.startTime = Date.now()
    this.moves = 0
    this.elapsedTime = 0
    this.updateDisplay()
    
    // Timer qui se met à jour chaque seconde
    this.timerInterval = setInterval(() => {
      this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000)
      this.updateTimerDisplay()
    }, 1000)
  }
  
  stop() {
    this.isRunning = false
    if (this.timerInterval) {
      clearInterval(this.timerInterval)
      this.timerInterval = null
    }
  }
  
  reset() {
    this.stop()
    this.moves = 0
    this.elapsedTime = 0
    this.startTime = null
    this.updateDisplay()
  }
  
  addMove() {
    // Démarrer le timer au premier mouvement
    if (!this.isRunning) {
      this.start()
    }
    this.moves++
    this.updateDisplay()
  }
  
  updateDisplay() {
    document.getElementById('moves-count').textContent = this.moves
    this.updateTimerDisplay()
  }
  
  updateTimerDisplay() {
    const minutes = Math.floor(this.elapsedTime / 60).toString().padStart(2, '0')
    const seconds = (this.elapsedTime % 60).toString().padStart(2, '0')
    document.getElementById('timer').textContent = `${minutes}:${seconds}`
  }
  
  getScore() {
    // Score basé sur les mouvements et le temps
    // Moins de mouvements et moins de temps = meilleur score
    const baseScore = 10000
    const movePenalty = this.moves * 50
    const timePenalty = this.elapsedTime * 10
    return Math.max(0, baseScore - movePenalty - timePenalty)
  }
  
  getMoves() {
    return this.moves
  }
  
  getTime() {
    return this.elapsedTime
  }
  
  getFormattedTime() {
    const minutes = Math.floor(this.elapsedTime / 60).toString().padStart(2, '0')
    const seconds = (this.elapsedTime % 60).toString().padStart(2, '0')
    return `${minutes}:${seconds}`
  }
}
