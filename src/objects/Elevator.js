import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { GRID_SIZE, COLORS, FLOORS, getAssetPath } from '../utils/constants.js'

export class Elevator {
  constructor(scene, x, z, floorIndex) {
    this.scene = scene
    this.x = x
    this.z = z
    this.floorIndex = floorIndex  // L'étage fixe de cet ascenseur
    this.y = FLOORS[floorIndex].y
    this.mesh = null
    this.model = null
    this.loader = new GLTFLoader()
    this.animationTime = 0
    this.keyIndicator = null  // Indicateur de touche "E"
    this.createElevator()
    this.createKeyIndicator()
  }
  
  createKeyIndicator() {
    // Créer un sprite avec la touche "E"
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128
    const ctx = canvas.getContext('2d')
    
    // Fond avec dégradé
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 60)
    gradient.addColorStop(0, 'rgba(255, 170, 0, 0.95)')
    gradient.addColorStop(1, 'rgba(255, 136, 0, 0.9)')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.roundRect(14, 14, 100, 100, 15)
    ctx.fill()
    
    // Bordure
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 4
    ctx.stroke()
    
    // Texte "E"
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 70px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('E', 64, 68)
    
    // Créer le sprite
    const texture = new THREE.CanvasTexture(canvas)
    const spriteMaterial = new THREE.SpriteMaterial({ 
      map: texture,
      transparent: true,
      depthTest: false
    })
    this.keyIndicator = new THREE.Sprite(spriteMaterial)
    this.keyIndicator.scale.set(1.2, 1.2, 1)
    this.keyIndicator.position.set(this.x, this.y + 2.5, this.z)
    this.keyIndicator.visible = false  // Caché par défaut
    
    this.scene.add(this.keyIndicator)
  }
  
  createElevator() {
    // Charger le modèle 3D de l'ascenseur
    this.loader.load(
      getAssetPath('/models/old_elevator.glb'),
      (gltf) => {
        this.model = gltf.scene
        
        // Ajuster l'échelle (hauteur réduite)
        const scale = 0.012
        const scaleY = 0.0085  // Hauteur réduite
        this.model.scale.set(scale, scaleY, scale)
        this.model.position.set(this.x, this.y + 0.05, this.z)
        
        // Configurer les ombres (sans émission)
        this.model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
            child.userData.isElevator = true
            child.userData.elevatorInstance = this
          }
        })
        
        this.mesh = this.model
        this.scene.add(this.model)
      },
      undefined,
      (error) => {
        console.error('❌ Erreur chargement ascenseur:', error)
        this.createFallbackElevator()
      }
    )
  }
  
  createFallbackElevator() {
    const geometry = new THREE.BoxGeometry(GRID_SIZE * 1.5, 0.3, GRID_SIZE * 1.5)
    const material = new THREE.MeshStandardMaterial({ 
      color: COLORS.elevator,
      roughness: 0.3,
      metalness: 0.7,
      emissive: COLORS.elevator,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.9
    })
    
    this.mesh = new THREE.Mesh(geometry, material)
    this.mesh.position.set(this.x, this.y + 0.15, this.z)
    this.mesh.castShadow = true
    this.mesh.receiveShadow = true
    this.mesh.userData.isElevator = true
    this.mesh.userData.elevatorInstance = this
    
    this.scene.add(this.mesh)
  }
  
  isVehicleOnElevator(vehiclePos) {
    return Math.abs(vehiclePos.x - this.x) < GRID_SIZE * 0.6 &&
           Math.abs(vehiclePos.z - this.z) < GRID_SIZE * 0.6 &&
           Math.abs(vehiclePos.y - this.y) < 0.5
  }
  
  getFloorIndex() {
    return this.floorIndex
  }
  
  canGoDown() {
    return this.floorIndex < FLOORS.length - 1
  }
  
  canGoUp() {
    return this.floorIndex > 0
  }
  
  // Déplace un véhicule vers l'étage du dessous
  moveVehicleToFloorBelow(vehicle) {
    if (!this.canGoDown()) return null
    
    const targetFloorIndex = this.floorIndex + 1
    const newY = FLOORS[targetFloorIndex].y
    vehicle.model.position.y = newY
    return targetFloorIndex
  }
  
  // Déplace un véhicule vers l'étage du dessus
  moveVehicleToFloorAbove(vehicle) {
    if (!this.canGoUp()) return null
    
    const targetFloorIndex = this.floorIndex - 1
    const newY = FLOORS[targetFloorIndex].y
    vehicle.model.position.y = newY
    return targetFloorIndex
  }
  
  update(deltaTime = 0.016) {
    // Animation de pulsation de l'indicateur
    if (this.keyIndicator && this.keyIndicator.visible) {
      this.animationTime += deltaTime
      const pulse = 1 + Math.sin(this.animationTime * 4) * 0.15
      this.keyIndicator.scale.set(1.2 * pulse, 1.2 * pulse, 1)
      
      // Petit mouvement vertical
      const bounce = Math.sin(this.animationTime * 3) * 0.1
      this.keyIndicator.position.y = this.y + 2.5 + bounce
    }
  }
  
  /**
   * Affiche l'indicateur "E" si le joueur est sur l'ascenseur
   * @param {Vehicle} playerVehicle - Le véhicule du joueur
   */
  showIndicatorIfPlayerOn(playerVehicle) {
    if (!playerVehicle || !this.keyIndicator) return
    
    const pos = playerVehicle.getPosition()
    const isOnElevator = this.isVehicleOnElevator(pos)
    
    this.keyIndicator.visible = isOnElevator
  }
  
  /**
   * Cache l'indicateur
   */
  hideIndicator() {
    if (this.keyIndicator) {
      this.keyIndicator.visible = false
    }
  }
}
