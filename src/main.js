import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { VehicleManager } from './game/VehicleManager.js'
import { CollisionManager } from './game/CollisionManager.js'
import { ScoreManager } from './game/ScoreManager.js'
import { InputController } from './controls/InputController.js'
import { ParkingFloors } from './scene/ParkingFloors.js'
import { ExitZone } from './objects/ExitZone.js'
import { Elevator } from './objects/Elevator.js'
import { COLORS, DIRECTIONS, FLOORS } from './utils/constants.js'

// ========== SETUP SCENE ==========
const canvas = document.querySelector('#canvas')
const scene = new THREE.Scene()
scene.background = new THREE.Color(COLORS.background)

// ========== CAMERA ==========
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.set(15, 8, 15)
camera.lookAt(0, -4, 0) // Regarder vers le centre des étages

// ========== RENDERER ==========
const renderer = new THREE.WebGLRenderer({ 
  canvas,
  antialias: true 
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// ========== CONTROLS ==========
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.maxPolarAngle = Math.PI / 2.2
controls.minDistance = 8
controls.maxDistance = 40
controls.target.set(0, -4, 0) // Cible au centre des étages

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
const parkingFloors = new ParkingFloors(scene)

// ========== ASCENSEURS ==========
// Pattern zigzag : ascenseur toujours à l'opposé du point d'arrivée
// Étage 0 : Taxi à droite → Ascenseur à gauche
// Étage -1 : Arrive à gauche → Ascenseur à droite
// Étage -2 : Arrive à droite → Sortie à gauche (pas besoin d'ascenseur)
const elevators = [
  new Elevator(scene, -6, 0, 0),   // Étage 0 : ascenseur à GAUCHE
  new Elevator(scene, 6, 0, 1)     // Étage -1 : ascenseur à DROITE
]

// ========== ZONE DE SORTIE ==========
// Positionnée tout en bas du parking (sous-sol -2), côté GAUCHE
const exitZone = new ExitZone(scene, -6, 0, FLOORS[2].y)
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

// Callback pour compter les mouvements
const onMove = () => {
  scoreManager.addMove()
}

const inputController = new InputController(camera, vehicleManager, collisionManager, elevators, onMove)

// Chargement des véhicules - NIVEAU 1
// Parking Jam classique : TOUS les véhicules sur UN seul axe
async function initVehicles() {
  // ==========================================
  // ÉTAGE 0 (Rez-de-chaussée) - y = 0
  // Taxi à droite (x=6) → doit aller à l'ascenseur à gauche (x=-6)
  // ==========================================
  
  // TAXI (Joueur) - HORIZONTAL uniquement
  playerVehicle = await vehicleManager.loadVehicle(
    '/models/taxi.glb',
    new THREE.Vector3(6, FLOORS[0].y, 0),
    DIRECTIONS.HORIZONTAL,
    COLORS.playerVehicle,
    Math.PI / 2  // Orienté vers la gauche
  )
  playerVehicle.isPlayer = true
  
  // --- Obstacles Étage 0 ---
  // Van vertical sur le chemin du taxi (ligne z=0)
  await vehicleManager.loadVehicle(
    '/models/van.glb',
    new THREE.Vector3(2, FLOORS[0].y, 0),
    DIRECTIONS.VERTICAL,
    null,
    0
  )
  
  // Van vertical bloquant aussi (ligne z=0)
  await vehicleManager.loadVehicle(
    '/models/van.glb',
    new THREE.Vector3(-2, FLOORS[0].y, 0),
    DIRECTIONS.VERTICAL,
    null,
    0
  )
  
  // Van horizontal en haut - bloque le van vertical
  await vehicleManager.loadVehicle(
    '/models/van.glb',
    new THREE.Vector3(2, FLOORS[0].y, -2),
    DIRECTIONS.HORIZONTAL,
    null,
    Math.PI / 2
  )
  
  // Van horizontal en bas
  await vehicleManager.loadVehicle(
    '/models/van.glb',
    new THREE.Vector3(-2, FLOORS[0].y, 2),
    DIRECTIONS.HORIZONTAL,
    null,
    Math.PI / 2
  )
  
  // Van vertical sur le côté
  await vehicleManager.loadVehicle(
    '/models/van.glb',
    new THREE.Vector3(4, FLOORS[0].y, -4),
    DIRECTIONS.VERTICAL,
    null,
    0
  )
  
  // Van horizontal en bas à droite
  await vehicleManager.loadVehicle(
    '/models/van.glb',
    new THREE.Vector3(0, FLOORS[0].y, 4),
    DIRECTIONS.HORIZONTAL,
    null,
    Math.PI / 2
  )
  
  // ==========================================
  // ÉTAGE -1 (Sous-sol 1) - y = -4
  // Arrive à gauche (x=-6) → doit aller à l'ascenseur à droite (x=6)
  // ==========================================
  
  // Van vertical bloquant le passage
  await vehicleManager.loadVehicle(
    '/models/van.glb',
    new THREE.Vector3(-2, FLOORS[1].y, 0),
    DIRECTIONS.VERTICAL,
    null,
    0
  )
  
  // Van vertical au centre
  await vehicleManager.loadVehicle(
    '/models/van.glb',
    new THREE.Vector3(2, FLOORS[1].y, 0),
    DIRECTIONS.VERTICAL,
    null,
    0
  )
  
  // Van horizontal en haut
  await vehicleManager.loadVehicle(
    '/models/van.glb',
    new THREE.Vector3(0, FLOORS[1].y, -2),
    DIRECTIONS.HORIZONTAL,
    null,
    Math.PI / 2
  )
  
  // Van horizontal en bas
  await vehicleManager.loadVehicle(
    '/models/van.glb',
    new THREE.Vector3(-4, FLOORS[1].y, 2),
    DIRECTIONS.HORIZONTAL,
    null,
    Math.PI / 2
  )
  
  // Van vertical côté droit
  await vehicleManager.loadVehicle(
    '/models/van.glb',
    new THREE.Vector3(4, FLOORS[1].y, 2),
    DIRECTIONS.VERTICAL,
    null,
    0
  )
  
  // Van horizontal en bas à droite
  await vehicleManager.loadVehicle(
    '/models/van.glb',
    new THREE.Vector3(2, FLOORS[1].y, 4),
    DIRECTIONS.HORIZONTAL,
    null,
    Math.PI / 2
  )
  
  // ==========================================
  // ÉTAGE -2 (Sous-sol 2) - y = -8
  // Arrive à droite (x=6) → doit aller à la sortie à gauche (x=-6)
  // ==========================================
  
  // Van vertical bloquant le passage
  await vehicleManager.loadVehicle(
    '/models/van.glb',
    new THREE.Vector3(2, FLOORS[2].y, 0),
    DIRECTIONS.VERTICAL,
    null,
    0
  )
  
  // Van vertical au centre-gauche
  await vehicleManager.loadVehicle(
    '/models/van.glb',
    new THREE.Vector3(-2, FLOORS[2].y, 0),
    DIRECTIONS.VERTICAL,
    null,
    0
  )
  
  // Van horizontal en haut
  await vehicleManager.loadVehicle(
    '/models/van.glb',
    new THREE.Vector3(0, FLOORS[2].y, -2),
    DIRECTIONS.HORIZONTAL,
    null,
    Math.PI / 2
  )
  
  // Van horizontal en bas
  await vehicleManager.loadVehicle(
    '/models/van.glb',
    new THREE.Vector3(4, FLOORS[2].y, 2),
    DIRECTIONS.HORIZONTAL,
    null,
    Math.PI / 2
  )
  
  // Van vertical côté gauche
  await vehicleManager.loadVehicle(
    '/models/van.glb',
    new THREE.Vector3(-4, FLOORS[2].y, -4),
    DIRECTIONS.VERTICAL,
    null,
    0
  )
  
  // Van horizontal tout en bas
  await vehicleManager.loadVehicle(
    '/models/van.glb',
    new THREE.Vector3(-2, FLOORS[2].y, 4),
    DIRECTIONS.HORIZONTAL,
    null,
    Math.PI / 2
  )
}

initVehicles()

// ========== ANIMATION LOOP ==========
function animate() {
  requestAnimationFrame(animate)
  vehicleManager.update()
  exitZone.update()
  elevators.forEach(elevator => elevator.update())
  
  // Vérifier si le joueur a gagné
  if (playerVehicle && !hasWon && !playerVehicle.isMoving()) {
    const pos = playerVehicle.getPosition()
    if (exitZone.isVehicleInZone(pos)) {
      hasWon = true
      scoreManager.stop()
      
      // Afficher l'écran de victoire
      showVictoryScreen()
    }
  }
  
  controls.update()
  renderer.render(scene, camera)
}

// ========== ÉCRAN DE VICTOIRE ==========
function showVictoryScreen() {
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
  
  content.innerHTML = `
    <h1 style="color: #00ff88; margin-bottom: 20px; font-size: 2.5em;">🎉 VICTOIRE !</h1>
    <p style="font-size: 1.2em; margin-bottom: 30px;">Niveau 1 terminé</p>
    <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin-bottom: 30px;">
      <p style="margin: 10px 0; font-size: 1.3em;">🚗 Mouvements: <strong>${scoreManager.getMoves()}</strong></p>
      <p style="margin: 10px 0; font-size: 1.3em;">⏱️ Temps: <strong>${scoreManager.getFormattedTime()}</strong></p>
      <p style="margin: 10px 0; font-size: 1.5em; color: #ffdd00;">⭐ Score: <strong>${scoreManager.getScore()}</strong></p>
    </div>
    <button id="restart-btn" style="
      background: #00ff88;
      color: #1a1a2e;
      border: none;
      padding: 15px 40px;
      font-size: 1.2em;
      border-radius: 10px;
      cursor: pointer;
      font-weight: bold;
      transition: transform 0.2s;
    ">Rejouer</button>
  `
  
  overlay.appendChild(content)
  document.body.appendChild(overlay)
  
  // Bouton restart
  document.getElementById('restart-btn').addEventListener('click', () => {
    location.reload()
  })
}

animate()
