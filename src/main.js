import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { VehicleManager } from './game/VehicleManager.js'
import { CollisionManager } from './game/CollisionManager.js'
import { InputController } from './controls/InputController.js'
import { ParkingFloors } from './scene/ParkingFloors.js'
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

// ========== CHARGEMENT VÉHICULES ==========
const textureLoader = new THREE.TextureLoader()
const carTexture = textureLoader.load('/textures/colormap.png')
carTexture.flipY = false
carTexture.colorSpace = THREE.SRGBColorSpace

// Initialisation des managers
const vehicleManager = new VehicleManager(scene, carTexture)
const collisionManager = new CollisionManager(vehicleManager)
const inputController = new InputController(camera, vehicleManager, collisionManager)

// Chargement des véhicules sur différents étages
async function initVehicles() {
  // ÉTAGE 0 (Rez-de-chaussée)
  await vehicleManager.loadVehicle(
    '/models/van.glb',
    new THREE.Vector3(-4, FLOORS[0].y, -4),
    DIRECTIONS.HORIZONTAL,
    null,
    0
  )
  
  await vehicleManager.loadVehicle(
    '/models/van.glb',
    new THREE.Vector3(4, FLOORS[0].y, 2),
    DIRECTIONS.VERTICAL,
    null,
    Math.PI / 2
  )
  
  // ÉTAGE -1 (Sous-sol 1)
  await vehicleManager.loadVehicle(
    '/models/van.glb',
    new THREE.Vector3(2, FLOORS[1].y, -2),
    DIRECTIONS.HORIZONTAL,
    null,
    0
  )
  
  await vehicleManager.loadVehicle(
    '/models/van.glb',
    new THREE.Vector3(-4, FLOORS[1].y, 4),
    DIRECTIONS.VERTICAL,
    null,
    Math.PI / 2
  )
  
  // ÉTAGE -2 (Sous-sol 2)
  await vehicleManager.loadVehicle(
    '/models/van.glb',
    new THREE.Vector3(0, FLOORS[2].y, 0),
    DIRECTIONS.HORIZONTAL,
    null,
    0
  )
}

initVehicles()

// ========== ANIMATION LOOP ==========
function animate() {
  requestAnimationFrame(animate)
  vehicleManager.update()
  controls.update()
  renderer.render(scene, camera)
}

animate()
