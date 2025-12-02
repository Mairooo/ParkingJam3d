import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// ========== SETUP SCENE ==========
const canvas = document.querySelector('#canvas')
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x1a1a2e)

// ========== CAMERA ==========
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.set(10, 12, 10)
camera.lookAt(0, 0, 0)

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
controls.maxPolarAngle = Math.PI / 2.2 // Limite rotation verticale
controls.minDistance = 5
controls.maxDistance = 30

// ========== LIGHTS ==========
// Lumière ambiante
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
scene.add(ambientLight)

// Lumière directionnelle (soleil)
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
directionalLight.position.set(10, 15, 5)
directionalLight.castShadow = true
directionalLight.shadow.camera.left = -20
directionalLight.shadow.camera.right = 20
directionalLight.shadow.camera.top = 20
directionalLight.shadow.camera.bottom = -20
directionalLight.shadow.mapSize.width = 2048
directionalLight.shadow.mapSize.height = 2048
scene.add(directionalLight)

// Lumière d'appoint
const fillLight = new THREE.DirectionalLight(0x4488ff, 0.3)
fillLight.position.set(-5, 10, -5)
scene.add(fillLight)

// ========== SOL / PARKING ==========
const floorGeometry = new THREE.PlaneGeometry(20, 20)
const floorMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x2d2d44,
  roughness: 0.8,
  metalness: 0.2
})
const floor = new THREE.Mesh(floorGeometry, floorMaterial)
floor.rotation.x = -Math.PI / 2
floor.receiveShadow = true
scene.add(floor)

// Grille de repères (temporaire)
const gridHelper = new THREE.GridHelper(20, 20, 0x444466, 0x333344)
scene.add(gridHelper)

// ========== CHARGEMENT VÉHICULE ==========
const loader = new GLTFLoader()
const textureLoader = new THREE.TextureLoader()
let selectedVehicle = null

// Charger la texture 
const carTexture = textureLoader.load('/textures/colormap.png')
carTexture.flipY = false // Important pour les GLTF
carTexture.colorSpace = THREE.SRGBColorSpace

// Fonction pour charger un modèle GLTF
function loadVehicle(path, position) {
  loader.load(
    path,
    (gltf) => {
      const model = gltf.scene
      model.position.copy(position)
      model.userData.isVehicle = true
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
          if (child.material) {
            child.material.map = carTexture
            child.material.needsUpdate = true
          }
        }
      })
      scene.add(model)
      console.log('Véhicule chargé avec texture:', path)
    },
    undefined,
    (error) => {
      console.error('Erreur de chargement:', error)
    }
  )
}

// Chargement du van
loadVehicle('/models/van.glb', new THREE.Vector3(0, 0, 0))

// ========== SYSTÈME DE GRILLE ==========
const GRID_SIZE = 2 // Taille d'une case de grille
const MOVE_SPEED = 0.1 // Vitesse d'interpolation

// ========== RAYCASTING ==========
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()
let selectedVehicleModel = null // Modèle 3D complet

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
}

function onMouseClick(event) {
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(scene.children, true)
  
  // Réinitialiser la couleur du véhicule précédent
  if (selectedVehicleModel) {
    selectedVehicleModel.traverse((child) => {
      if (child.isMesh && child.material.emissive) {
        child.material.emissive.setHex(0x000000)
      }
    })
  }
  
  selectedVehicleModel = null
  
  // Chercher un véhicule cliqué
  for (let intersect of intersects) {
    let object = intersect.object
    
    // Remonter jusqu'au parent avec userData.isVehicle
    while (object && !object.userData.isVehicle) {
      object = object.parent
    }
    
    if (object && object.userData.isVehicle) {
      selectedVehicleModel = object
      // Highlight tous les meshes du véhicule
      object.traverse((child) => {
        if (child.isMesh && child.material.emissive) {
          child.material.emissive.setHex(0x00ff00)
        }
      })
      console.log('Véhicule sélectionné:', object.name || 'véhicule')
      break
    }
  }
}

// ========== DÉPLACEMENT CLAVIER ==========
function onKeyDown(event) {
  if (!selectedVehicleModel) return
  
  const currentPos = selectedVehicleModel.position
  let targetX = currentPos.x
  let targetZ = currentPos.z
  
  switch(event.key) {
    case 'ArrowUp':
    case 'z':
      targetZ -= GRID_SIZE
      break
    case 'ArrowDown':
    case 's':
      targetZ += GRID_SIZE
      break
    case 'ArrowLeft':
    case 'q':
      targetX -= GRID_SIZE
      break
    case 'ArrowRight':
    case 'd':
      targetX += GRID_SIZE
      break
    default:
      return
  }
  
  // Limites du parking (10x10 cases)
  const maxBound = 10
  const minBound = -10
  
  if (targetX >= minBound && targetX <= maxBound && 
      targetZ >= minBound && targetZ <= maxBound) {
    
    // Animation fluide vers la nouvelle position
    selectedVehicleModel.userData.targetX = targetX
    selectedVehicleModel.userData.targetZ = targetZ
    
    console.log(`Déplacement vers (${targetX}, ${targetZ})`)
  }
}

window.addEventListener('mousemove', onMouseMove)
window.addEventListener('click', onMouseClick)
window.addEventListener('keydown', onKeyDown)

// ========== ANIMATION LOOP ==========
function animate() {
  requestAnimationFrame(animate)
  
  // Interpolation fluide des véhicules vers leur position cible
  scene.traverse((object) => {
    if (object.userData.isVehicle) {
      if (object.userData.targetX !== undefined) {
        object.position.x += (object.userData.targetX - object.position.x) * MOVE_SPEED
        // Si très proche, snap à la position exacte
        if (Math.abs(object.userData.targetX - object.position.x) < 0.01) {
          object.position.x = object.userData.targetX
          object.userData.targetX = undefined
        }
      }
      if (object.userData.targetZ !== undefined) {
        object.position.z += (object.userData.targetZ - object.position.z) * MOVE_SPEED
        if (Math.abs(object.userData.targetZ - object.position.z) < 0.01) {
          object.position.z = object.userData.targetZ
          object.userData.targetZ = undefined
        }
      }
    }
  })
  
  controls.update()
  renderer.render(scene, camera)
}

animate()
