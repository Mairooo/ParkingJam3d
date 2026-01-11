import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Vehicle } from '../objects/Vehicle.js'
import { getAssetPath } from '../utils/constants.js'

// Échelle des véhicules (réduire pour éviter qu'ils se touchent)
const VEHICLE_SCALE = 0.8

export class VehicleManager {
  constructor(scene, texture) {
    this.scene = scene
    this.texture = texture
    this.loader = new GLTFLoader()
    this.vehicles = []
  }
  
  async loadVehicle(path, position, direction, color, rotation = 0) {
    // Convertir le chemin pour GitHub Pages
    const assetPath = getAssetPath(path)
    return new Promise((resolve, reject) => {
      this.loader.load(
        assetPath,
        (gltf) => {
          const model = gltf.scene
          
          // Réduire la taille du véhicule
          model.scale.set(VEHICLE_SCALE, VEHICLE_SCALE, VEHICLE_SCALE)
          
          // Appliquer la texture et les ombres
          model.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true
              child.receiveShadow = true
              if (child.material) {
                child.material.map = this.texture
                child.material.needsUpdate = true
              }
            }
          })
          
          // Appliquer la rotation (orientation du véhicule)
          model.rotation.y = rotation
          
          // Remonter légèrement le véhicule pour éviter que les roues traversent le sol
          position.y += 0.05
          
          // Créer l'instance Vehicle
          const vehicle = new Vehicle(model, position, direction, color)
          this.vehicles.push(vehicle)
          this.scene.add(model)
          
          // Vehicule charge
          resolve(vehicle)
        },
        undefined,
        (error) => {
          console.error('Erreur de chargement:', error)
          reject(error)
        }
      )
    })
  }
  
  getVehicleFromObject(object) {
    // Remonter jusqu'au parent avec userData.vehicleInstance
    while (object && !object.userData.vehicleInstance) {
      object = object.parent
    }
    return object?.userData.vehicleInstance || null
  }
  
  update() {
    this.vehicles.forEach(vehicle => vehicle.update())
  }
  
  getAllVehicles() {
    return this.vehicles
  }
}
