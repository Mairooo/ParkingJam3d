import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Vehicle } from '../objects/Vehicle.js'

export class VehicleManager {
  constructor(scene, texture) {
    this.scene = scene
    this.texture = texture
    this.loader = new GLTFLoader()
    this.vehicles = []
  }
  
  async loadVehicle(path, position, direction, color, rotation = 0) {
    return new Promise((resolve, reject) => {
      this.loader.load(
        path,
        (gltf) => {
          const model = gltf.scene
          
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
