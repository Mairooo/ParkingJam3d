import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { VehicleManager } from './game/VehicleManager.js'
import { CollisionManager } from './game/CollisionManager.js'
import { ScoreManager } from './game/ScoreManager.js'
import { MoveManager } from './game/MoveManager.js'
import { SaveManager } from './game/SaveManager.js'
import { InputController } from './controls/InputController.js'
import { ParkingFloors } from './scene/ParkingFloors.js'
import { ExitZone } from './objects/ExitZone.js'
import { Elevator } from './objects/Elevator.js'
import { COLORS, DIRECTIONS, FLOORS } from './utils/constants.js'
import { LevelManager, LEVELS } from './game/LevelManager.js'

// ========== LEVEL MANAGER ==========
const levelManager = new LevelManager()

// ========== SETUP SCENE ==========
const canvas = document.querySelector('#canvas')
const scene = new THREE.Scene()
scene.background = new THREE.Color(COLORS.background)

// ========== CAMERAS ==========
// Caméra globale (vue d'ensemble)
const globalCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
globalCamera.position.set(15, 8, 15)
globalCamera.lookAt(0, -3.2, 0) // Regarder vers le centre des étages

// Caméra proche du taxi (suit le joueur)
const taxiCamera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
taxiCamera.position.set(4, 2, 4) // Position initiale près du taxi (plus basse)

// Caméra active
let activeCamera = globalCamera
let isTaxiCameraActive = false

// ========== CLIPPING PLANES (pour découper le parking) ==========
// Zone de jeu : environ x=-10 à x=6, z=-6 à z=6
const clippingPlanes = [
  new THREE.Plane(new THREE.Vector3(1, 0, 0), 13),   // Gauche (x > -10)
  new THREE.Plane(new THREE.Vector3(-1, 0, 0), 8),  // Droite (x < 8)
  new THREE.Plane(new THREE.Vector3(0, 0, 1), 7),   // Avant (z > -7)
  new THREE.Plane(new THREE.Vector3(0, 0, -1), 7),  // Arrière (z < 7)
]

// ========== RENDERER ==========
const renderer = new THREE.WebGLRenderer({ 
  canvas,
  antialias: true 
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.localClippingEnabled = true // Activer le clipping pour découper le parking

// ========== GESTION DU REDIMENSIONNEMENT ==========
window.addEventListener('resize', () => {
  const width = window.innerWidth
  const height = window.innerHeight
  
  // Mettre à jour les deux caméras
  globalCamera.aspect = width / height
  globalCamera.updateProjectionMatrix()
  
  taxiCamera.aspect = width / height
  taxiCamera.updateProjectionMatrix()
  
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// ========== CONTROLS ==========
// Contrôles pour la caméra globale
const globalControls = new OrbitControls(globalCamera, canvas)
globalControls.enableDamping = true
globalControls.dampingFactor = 0.05
globalControls.maxPolarAngle = Math.PI / 2.2
globalControls.minDistance = 8
globalControls.maxDistance = 40
globalControls.target.set(0, -3.2, 0) // Cible au centre des étages

// Contrôles pour la caméra taxi
const taxiControls = new OrbitControls(taxiCamera, canvas)
taxiControls.enableDamping = true
taxiControls.dampingFactor = 0.05
taxiControls.maxPolarAngle = Math.PI / 2.5
taxiControls.minDistance = 4
taxiControls.maxDistance = 15
taxiControls.enabled = false // Désactivé par défaut

// Référence aux contrôles actifs
let activeControls = globalControls

// ========== LIGHTS ==========
// Lumière ambiante
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
scene.add(ambientLight)

// Lumière directionnelle (soleil)
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
directionalLight.position.set(10, 10, 5)
directionalLight.castShadow = true
directionalLight.shadow.camera.left = -20
directionalLight.shadow.camera.right = 20
directionalLight.shadow.camera.top = 5
directionalLight.shadow.camera.bottom = -15
directionalLight.shadow.mapSize.width = 2048
directionalLight.shadow.mapSize.height = 2048
scene.add(directionalLight)

// Lumière d'appoint
const fillLight = new THREE.DirectionalLight(0x4488ff, 0.3)
fillLight.position.set(-5, 10, -5)
scene.add(fillLight)

// ========== PARKING MULTI-ÉTAGES ==========
const parkingFloors = new ParkingFloors(scene, clippingPlanes)

// ========== ASCENSEURS (dynamiques selon le niveau) ==========
const currentLevelConfig = levelManager.getCurrentLevel()
const elevators = currentLevelConfig.elevators.map(e => 
  new Elevator(scene, e.x, e.z, e.floorIndex)
)

// ========== ZONE DE SORTIE (dynamique selon le niveau) ==========
const exitFloorY = FLOORS[currentLevelConfig.exitFloor].y
const exitZone = new ExitZone(scene, currentLevelConfig.exitPosition.x, currentLevelConfig.exitPosition.z, exitFloorY)
let playerVehicle = null
let hasWon = false

// ========== CHARGEMENT VÉHICULES ==========
const textureLoader = new THREE.TextureLoader()
const carTexture = textureLoader.load('/textures/colormap.png')
carTexture.flipY = false
carTexture.colorSpace = THREE.SRGBColorSpace

// Initialisation des managers
const vehicleManager = new VehicleManager(scene, carTexture)
const collisionManager = new CollisionManager(vehicleManager)
const scoreManager = new ScoreManager()
const moveManager = new MoveManager()
const saveManager = new SaveManager()

// Callback pour compter les mouvements
const onMove = (vehicle, fromX, fromZ, toX, toZ) => {
  scoreManager.addMove()
  moveManager.addMove(vehicle, fromX, fromZ, toX, toZ)
  
  // Auto-save après chaque mouvement
  if (saveManager.autoSaveEnabled) {
    saveManager.saveGameState(vehicleManager, scoreManager, moveManager.history)
  }
}

let inputController = new InputController(activeCamera, vehicleManager, collisionManager, elevators, onMove)

// Fonction pour changer de caméra
function switchCamera() {
  isTaxiCameraActive = !isTaxiCameraActive
  
  if (isTaxiCameraActive) {
    activeCamera = taxiCamera
    activeControls = taxiControls
    globalControls.enabled = false
    taxiControls.enabled = true
    
    // Positionner la caméra taxi près du joueur
    if (playerVehicle) {
      updateTaxiCamera()
    }
  } else {
    activeCamera = globalCamera
    activeControls = globalControls
    taxiControls.enabled = false
    globalControls.enabled = true
  }
  
  // Mettre à jour l'InputController avec la nouvelle caméra
  inputController.updateCamera(activeCamera)
}

// Fonction pour mettre à jour la position de la caméra taxi
function updateTaxiCamera() {
  if (!playerVehicle || !isTaxiCameraActive) return
  
  const pos = playerVehicle.getPosition()
  
  // Distance et hauteur de la caméra
  // Hauteur réduite pour rester sous le plafond (étages = 4 de haut)
  const distance = 6
  const height = 1.8
  
  // Positionner la caméra en fonction de la position du taxi sur l'étage
  // Si le taxi est à droite (x > 0), la caméra vient de la droite pour voir vers la gauche
  // Si le taxi est à gauche (x < 0), la caméra vient de la gauche pour voir vers la droite
  let cameraX, cameraZ
  
  if (pos.x > 0) {
    // Taxi à droite, caméra derrière-droite, regarde vers la gauche
    cameraX = pos.x + distance * 0.7
    cameraZ = pos.z + distance * 0.5
  } else {
    // Taxi à gauche, caméra derrière-gauche, regarde vers la droite
    cameraX = pos.x - distance * 0.7
    cameraZ = pos.z + distance * 0.5
  }
  
  const targetPosition = new THREE.Vector3(cameraX, pos.y + height, cameraZ)
  
  // Interpolation douce de la caméra
  taxiCamera.position.lerp(targetPosition, 0.05)
  
  // La caméra regarde le taxi
  const lookAtPos = new THREE.Vector3(pos.x, pos.y + 0.5, pos.z)
  taxiControls.target.lerp(lookAtPos, 0.05)
}

// Écouter la touche 'C' pour changer de caméra
window.addEventListener('keydown', (event) => {
  if (event.key === 'c' || event.key === 'C') {
    switchCamera()
  }
  
  // Ctrl+Z pour annuler le dernier mouvement
  if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
    event.preventDefault() // Empêcher le comportement par défaut du navigateur
    
    if (moveManager.canUndo()) {
      moveManager.undo()
      
      // Décrémenter le compteur de mouvements
      scoreManager.moves = Math.max(0, scoreManager.moves - 1)
      scoreManager.updateDisplay()
      
      console.log('Mouvement annulé')
    } else {
      console.log('Aucun mouvement à annuler')
    }
  }
})

// ========== GUI lil-gui ==========
const gui = new GUI()
const guiParams = {
  etage: 'Rez-de-chaussée',
  showGrid: true,
  currentLevel: levelManager.currentLevel,
  resetLevel: () => {
    location.reload()
  },
  loadLevel: () => {
    localStorage.setItem('parkingJam_selectedLevel', guiParams.currentLevel)
    location.reload()
  }
}

// Charger le niveau sélectionné
const savedLevel = localStorage.getItem('parkingJam_selectedLevel')
if (savedLevel) {
  levelManager.setLevel(parseInt(savedLevel))
  guiParams.currentLevel = levelManager.currentLevel
  localStorage.removeItem('parkingJam_selectedLevel')
}

// Dossier "Jeu"
const gameFolder = gui.addFolder('Jeu')
gameFolder.add(guiParams, 'currentLevel', { 'Niveau 1 - Facile': 1, 'Niveau 2 - Moyen': 2, 'Niveau 3 - Difficile': 3 }).name('Niveau')
gameFolder.add(guiParams, 'loadLevel').name('▶ Lancer ce niveau')
gameFolder.add(guiParams, 'etage').name('Étage actuel').listen().disable()
gameFolder.add(guiParams, 'resetLevel').name('↺ Recommencer')

// Dossier "Caméra"
const cameraFolder = gui.addFolder('Caméra')
const cameraParams = {
  cameraType: 'Vue globale',
  switchCamera: () => {
    switchCamera()
    cameraParams.cameraType = isTaxiCameraActive ? 'Vue taxi' : 'Vue globale'
  }
}
cameraFolder.add(cameraParams, 'cameraType').name('Caméra active').listen().disable()
cameraFolder.add(cameraParams, 'switchCamera').name('Changer (touche C)')

// Dossier "Affichage"
const displayFolder = gui.addFolder('Affichage')
displayFolder.add(guiParams, 'showGrid').name('Afficher grille').onChange((value) => {
  parkingFloors.toggleGrids(value)
})

// Afficher le niveau actuel dans la console
console.log(`🎮 Niveau ${levelManager.currentLevel} chargé: ${levelManager.getCurrentLevel().name}`)

// Fonction pour mettre à jour l'étage affiché
function updateTaxiFloorDisplay() {
  if (!playerVehicle) return
  const y = playerVehicle.getPosition().y
  const floor = FLOORS.find(f => Math.abs(f.y - y) < 0.5)
  if (floor) {
    guiParams.etage = floor.name
  }
}

// Chargement des véhicules depuis le LevelManager
async function initVehicles() {
  const level = levelManager.getCurrentLevel()
  console.log(`Chargement du ${level.name}...`)
  
  // Charger le joueur (taxi)
  const p = level.player
  playerVehicle = await vehicleManager.loadVehicle(
    p.model,
    new THREE.Vector3(p.position.x, p.position.y, p.position.z),
    p.direction,
    COLORS.playerVehicle,
    p.rotation
  )
  playerVehicle.isPlayer = true
  
  // Charger tous les véhicules obstacles
  for (const v of level.vehicles) {
    await vehicleManager.loadVehicle(
      v.model,
      new THREE.Vector3(v.position.x, v.position.y, v.position.z),
      v.direction,
      null,
      v.rotation
    )
  }
  
  console.log(`✅ ${level.vehicles.length + 1} véhicules chargés`)
}

initVehicles().then(() => {
  // Charger la sauvegarde si elle existe
  const savedState = saveManager.load()
  if (savedState && savedState.vehicles) {
    // Demander si on veut reprendre
    if (confirm('Une partie sauvegardée a été trouvée. Voulez-vous la reprendre ?')) {
      saveManager.restoreGameState(vehicleManager, scoreManager, savedState)
    } else {
      saveManager.clearSave()
    }
  }
  
  // Afficher le meilleur score dans la console
  const bestScore = saveManager.getBestScore()
  if (bestScore) {
    console.log(`Meilleur score: ${bestScore.moves} mouvements en ${Math.floor(bestScore.time/60)}:${(bestScore.time%60).toString().padStart(2,'0')}`)
  }
})

// ========== ANIMATION LOOP ==========
function animate() {
  requestAnimationFrame(animate)
  vehicleManager.update()
  exitZone.update()
  elevators.forEach(elevator => elevator.update())
  
  // Mettre à jour l'affichage de l'étage du taxi
  updateTaxiFloorDisplay()
  
  // Mettre à jour la caméra taxi si active
  updateTaxiCamera()
  
  // Vérifier si le joueur a gagné
  if (playerVehicle && !hasWon && !playerVehicle.isMoving()) {
    const pos = playerVehicle.getPosition()
    if (exitZone.isVehicleInZone(pos)) {
      hasWon = true
      scoreManager.stop()
      
      // Sauvegarder le meilleur score et effacer la sauvegarde de partie
      saveManager.saveBestScore(scoreManager.moves, scoreManager.elapsedTime)
      saveManager.clearSave()
      
      // Afficher l'écran de victoire
      showVictoryScreen()
    }
  }
  
  activeControls.update()
  renderer.render(scene, activeCamera)
}

// ========== ÉCRAN DE VICTOIRE ==========
function showVictoryScreen() {
  const bestScore = saveManager.getBestScore()
  const isNewBest = bestScore && bestScore.moves === scoreManager.moves && bestScore.time === scoreManager.elapsedTime
  const hasNextLevel = levelManager.currentLevel < levelManager.getLevelCount()
  
  // Débloquer le niveau suivant
  if (hasNextLevel) {
    levelManager.unlockLevel(levelManager.currentLevel + 1)
  }
  
  const overlay = document.createElement('div')
  overlay.id = 'victory-screen'
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  `
  
  const content = document.createElement('div')
  content.style.cssText = `
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    padding: 40px 60px;
    border-radius: 20px;
    text-align: center;
    color: white;
    font-family: 'Segoe UI', Arial, sans-serif;
    box-shadow: 0 0 30px rgba(0, 255, 136, 0.3);
    border: 2px solid #00ff88;
  `
  
  // Formater le meilleur temps
  let bestScoreHTML = ''
  if (bestScore) {
    const bestMinutes = Math.floor(bestScore.time / 60).toString().padStart(2, '0')
    const bestSeconds = (bestScore.time % 60).toString().padStart(2, '0')
    bestScoreHTML = `
      <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.2);">
        <p style="margin: 5px 0; font-size: 1em; color: #aaa;">🏆 Meilleur score: <strong>${bestScore.moves}</strong> mouvements en <strong>${bestMinutes}:${bestSeconds}</strong></p>
        ${isNewBest ? '<p style="color: #ffdd00; font-size: 1.1em; margin-top: 10px;">🎊 Nouveau record !</p>' : ''}
      </div>
    `
  }
  
  // Bouton niveau suivant
  const nextLevelBtn = hasNextLevel ? `
    <button id="next-level-btn" style="
      background: #00ff88;
      color: #1a1a2e;
      border: none;
      padding: 15px 40px;
      font-size: 1.2em;
      border-radius: 10px;
      cursor: pointer;
      font-weight: bold;
      margin-right: 15px;
    ">▶ Niveau suivant</button>
  ` : ''
  
  content.innerHTML = `
    <h1 style="color: #00ff88; margin-bottom: 20px; font-size: 2.5em;">🎉 VICTOIRE !</h1>
    <p style="font-size: 1.2em; margin-bottom: 30px;">${levelManager.getCurrentLevel().name} terminé !</p>
    <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin-bottom: 30px;">
      <p style="margin: 10px 0; font-size: 1.3em;">🚗 Mouvements: <strong>${scoreManager.getMoves()}</strong></p>
      <p style="margin: 10px 0; font-size: 1.3em;">⏱️ Temps: <strong>${scoreManager.getFormattedTime()}</strong></p>
      <p style="margin: 10px 0; font-size: 1.5em; color: #ffdd00;">⭐ Score: <strong>${scoreManager.getScore()}</strong></p>
      ${bestScoreHTML}
    </div>
    <div>
      ${nextLevelBtn}
      <button id="restart-btn" style="
        background: transparent;
        color: #00ff88;
        border: 2px solid #00ff88;
        padding: 15px 40px;
        font-size: 1.2em;
        border-radius: 10px;
        cursor: pointer;
        font-weight: bold;
      ">↻ Rejouer</button>
    </div>
  `
  
  overlay.appendChild(content)
  document.body.appendChild(overlay)
  
  // Bouton restart
  document.getElementById('restart-btn').addEventListener('click', () => {
    location.reload()
  })
  
  // Bouton niveau suivant
  if (hasNextLevel) {
    document.getElementById('next-level-btn').addEventListener('click', () => {
      localStorage.setItem('parkingJam_selectedLevel', levelManager.currentLevel + 1)
      location.reload()
    })
  }
}

animate()
