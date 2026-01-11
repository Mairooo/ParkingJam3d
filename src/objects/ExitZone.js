import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { GRID_SIZE, COLORS, getAssetPath } from '../utils/constants.js'

export class ExitZone {
  constructor(scene, x, z, y = 0) {
    this.scene = scene
    this.position = { x, y, z }
    this.mesh = null
    this.model = null
    this.loader = new GLTFLoader()
    this.createZone()
  }
  
  createZone() {
    // Charger le modèle 3D de la sortie
    this.loader.load(
      getAssetPath('/models/parking_garage_entrance_gates.glb'),
      (gltf) => {
        this.model = gltf.scene
        
        // Ajuster l'échelle et la position
        const scale = 1.0
        this.model.scale.set(scale, scale, scale)
        this.model.position.set(this.position.x , this.position.y, this.position.z + 2)  // Décalé vers la droite
        this.model.rotation.y = Math.PI / 2
        
        // Configurer les ombres
        this.model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
            child.userData.isExitZone = true
          }
        })
        
        this.mesh = this.model
        this.scene.add(this.model)
        console.log(`Sortie chargée à (${this.position.x}, ${this.position.y}, ${this.position.z})`)
      },
      undefined,
      (error) => {
        console.error('❌ Erreur chargement sortie:', error)
        this.createFallbackZone()
      }
    )
  }
  
  createFallbackZone() {
    const geometry = new THREE.BoxGeometry(GRID_SIZE * 1.2, 0.3, GRID_SIZE * 1.2)
    const material = new THREE.MeshStandardMaterial({ 
      color: COLORS.exitZone,
      roughness: 0.4,
      metalness: 0.6,
      emissive: COLORS.exitZone,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.8
    })
    
    this.mesh = new THREE.Mesh(geometry, material)
    this.mesh.position.set(this.position.x, this.position.y + 0.15, this.position.z)
    this.mesh.userData.isExitZone = true
    
    this.scene.add(this.mesh)
  }
  
  isVehicleInZone(vehiclePos) {
    return Math.abs(vehiclePos.x - this.position.x) < GRID_SIZE * 0.5 &&
           Math.abs(vehiclePos.z - this.position.z) < GRID_SIZE * 0.5 &&
           Math.abs(vehiclePos.y - this.position.y) < 0.5
  }
  
  update(deltaTime = 0.016) {
    // Plus d'animation de pulsation pour le modèle 3D
  }
}
