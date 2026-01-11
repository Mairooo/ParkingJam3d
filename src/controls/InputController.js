import * as THREE from 'three'
import { GRID_SIZE, PARKING_BOUNDS, DIRECTIONS } from '../utils/constants.js'

export class InputController {
  constructor(camera, vehicleManager, collisionManager, elevators = [], onMove = null, directionHelper = null, scene = null) {
    this.camera = camera
    this.vehicleManager = vehicleManager
    this.collisionManager = collisionManager
    this.elevators = elevators
    this.onMove = onMove  // Callback quand un mouvement est effectué
    this.directionHelper = directionHelper  // Helper visuel pour les directions
    this.scene = scene  // Référence à la scène pour ajouter le helper
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()
    this.selectedVehicle = null
    this.hoveredVehicle = null  // Pour le hover highlight
    this.debugMode = true  // Affiche les coordonnées au clic
    this.groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)  // Plan Y=0
    
    this.setupEventListeners()
  }
  
  // Méthode pour mettre à jour la caméra (changement de vue)
  updateCamera(newCamera) {
    this.camera = newCamera
  }
  
  setupEventListeners() {
    window.addEventListener('mousemove', (e) => this.onMouseMove(e))
    window.addEventListener('click', (e) => this.onMouseClick(e))
    window.addEventListener('keydown', (e) => this.onKeyDown(e))
  }
  
  onMouseMove(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    
    // Hover highlight
    this.raycaster.setFromCamera(this.mouse, this.camera)
    const intersects = this.raycaster.intersectObjects(
      this.vehicleManager.vehicles.map(v => v.model),
      true
    )
    
    // Retirer le hover du véhicule précédent
    if (this.hoveredVehicle && this.hoveredVehicle !== this.selectedVehicle) {
      this.hoveredVehicle.unhover()
    }
    
    this.hoveredVehicle = null
    
    // Appliquer le hover au nouveau véhicule
    if (intersects.length > 0) {
      const vehicle = this.vehicleManager.getVehicleFromObject(intersects[0].object)
      if (vehicle && vehicle !== this.selectedVehicle) {
        this.hoveredVehicle = vehicle
        vehicle.hover()
      }
    }
  }
  
  onMouseClick(event) {
    this.raycaster.setFromCamera(this.mouse, this.camera)
    
    // MODE DEBUG: Afficher les coordonnées du clic sur le sol
    if (this.debugMode) {
      const intersectPoint = new THREE.Vector3()
      this.raycaster.ray.intersectPlane(this.groundPlane, intersectPoint)
      if (intersectPoint) {
        // Afficher coordonnées BRUTES précises (2 décimales)
        console.log(`Coordonnées BRUTES: x=${intersectPoint.x.toFixed(2)}, z=${intersectPoint.z.toFixed(2)}`)
      }
    }
    
    const intersects = this.raycaster.intersectObjects(
      this.vehicleManager.vehicles.map(v => v.model), 
      true
    )
    
    // Désélectionner le véhicule précédent
    if (this.selectedVehicle) {
      this.selectedVehicle.deselect()
      // Cacher le helper de direction
      if (this.directionHelper) {
        this.directionHelper.hide()
      }
    }
    
    this.selectedVehicle = null
    
    // Chercher un véhicule cliqué
    if (intersects.length > 0) {
      const vehicle = this.vehicleManager.getVehicleFromObject(intersects[0].object)
      if (vehicle) {
        this.selectedVehicle = vehicle
        vehicle.select()
        // Afficher le helper de direction
        if (this.directionHelper && this.scene) {
          this.directionHelper.show(vehicle, this.scene, this.collisionManager)
        }
      }
    }
  }
  
  onKeyDown(event) {
    if (!this.selectedVehicle) return
    
    const currentPos = this.selectedVehicle.getPosition()
    const direction = this.selectedVehicle.direction
    let targetX = currentPos.x
    let targetZ = currentPos.z
    let moveDirection = null
    
    // Gestion ascenseur avec E uniquement
    if (event.key === 'e' || event.key === 'E') {
      // Descendre d'un étage
      const elevator = this.elevators.find(e => e.isVehicleOnElevator(currentPos))
      if (elevator && elevator.canGoDown()) {
        const newFloorIndex = elevator.moveVehicleToFloorBelow(this.selectedVehicle)
        if (newFloorIndex !== null) {
          console.log(`Descente vers l'étage ${newFloorIndex}`)
          // Notifier avec direction elevator-down
          if (this.onMove) {
            this.onMove(this.selectedVehicle, currentPos.x, currentPos.z, currentPos.x, currentPos.z, 'elevator-down')
          }
        }
      }
      return
    }
    
    // Déplacement basé sur la direction autorisée du véhicule
    // Q = avancer (forward), D = reculer (backward)
    // Pour véhicule horizontal : Q = gauche, D = droite
    // Pour véhicule vertical : Q = haut, D = bas
    let exactDirection = null
    
    // Vérifier si on est en mode tutoriel et bloquer les mauvaises touches
    const tutorialStep = window.tutorialStep
    const TUTORIAL_STEPS = window.TUTORIAL_STEPS
    
    switch(event.key.toLowerCase()) {
      case 'q':
        // Q = avancer (forward)
        // Tutoriel : bloquer si on n'attend pas Q (avancer)
        if (TUTORIAL_STEPS && tutorialStep !== null && tutorialStep !== TUTORIAL_STEPS.DONE && tutorialStep !== TUTORIAL_STEPS.GOAL) {
          if (tutorialStep !== TUTORIAL_STEPS.FORWARD) {
            this.selectedVehicle.flashCollision()
            return
          }
        }
        
        if (direction === DIRECTIONS.HORIZONTAL) {
          targetX -= GRID_SIZE  // Vers la gauche (-X) = forward pour horizontal
          moveDirection = 'horizontal'
          exactDirection = 'left'
        } else if (direction === DIRECTIONS.VERTICAL) {
          targetZ -= GRID_SIZE  // Vers le haut (-Z) = forward pour vertical
          moveDirection = 'vertical'
          exactDirection = 'up'
        }
        break
        
      case 'd':
        // D = reculer (backward)
        // Tutoriel : bloquer si on n'attend pas D (reculer)
        if (TUTORIAL_STEPS && tutorialStep !== null && tutorialStep !== TUTORIAL_STEPS.DONE && tutorialStep !== TUTORIAL_STEPS.GOAL) {
          if (tutorialStep !== TUTORIAL_STEPS.BACKWARD) {
            this.selectedVehicle.flashCollision()
            return
          }
        }
        
        if (direction === DIRECTIONS.HORIZONTAL) {
          targetX += GRID_SIZE  // Vers la droite (+X) = backward pour horizontal
          moveDirection = 'horizontal'
          exactDirection = 'right'
        } else if (direction === DIRECTIONS.VERTICAL) {
          targetZ += GRID_SIZE  // Vers le bas (+Z) = backward pour vertical
          moveDirection = 'vertical'
          exactDirection = 'down'
        }
        break
        
      case 'arrowup':
      case 'z':
        // Tutoriel : bloquer les flèches/ZQSD pendant les étapes guidées
        if (TUTORIAL_STEPS && tutorialStep !== null && tutorialStep !== TUTORIAL_STEPS.DONE && tutorialStep !== TUTORIAL_STEPS.GOAL) {
          this.selectedVehicle.flashCollision()
          return
        }
        if (direction === DIRECTIONS.VERTICAL) {
          targetZ -= GRID_SIZE
          moveDirection = 'vertical'
          exactDirection = 'up'
        }
        break
      case 'arrowdown':
      case 's':
        // Tutoriel : bloquer les flèches/ZQSD pendant les étapes guidées
        if (TUTORIAL_STEPS && tutorialStep !== null && tutorialStep !== TUTORIAL_STEPS.DONE && tutorialStep !== TUTORIAL_STEPS.GOAL) {
          this.selectedVehicle.flashCollision()
          return
        }
        if (direction === DIRECTIONS.VERTICAL) {
          targetZ += GRID_SIZE
          moveDirection = 'vertical'
          exactDirection = 'down'
        }
        break
      case 'arrowleft':
        // Tutoriel : bloquer les flèches pendant les étapes guidées
        if (TUTORIAL_STEPS && tutorialStep !== null && tutorialStep !== TUTORIAL_STEPS.DONE && tutorialStep !== TUTORIAL_STEPS.GOAL) {
          this.selectedVehicle.flashCollision()
          return
        }
        if (direction === DIRECTIONS.HORIZONTAL) {
          targetX -= GRID_SIZE
          moveDirection = 'horizontal'
          exactDirection = 'left'
        }
        break
      case 'arrowright':
        // Tutoriel : bloquer les flèches pendant les étapes guidées
        if (TUTORIAL_STEPS && tutorialStep !== null && tutorialStep !== TUTORIAL_STEPS.DONE && tutorialStep !== TUTORIAL_STEPS.GOAL) {
          this.selectedVehicle.flashCollision()
          return
        }
        if (direction === DIRECTIONS.HORIZONTAL) {
          targetX += GRID_SIZE
          moveDirection = 'horizontal'
          exactDirection = 'right'
        }
        break
      default:
        return
    }
    
    // Arrondir pour rester sur la grille
    targetX = Math.round(targetX / GRID_SIZE) * GRID_SIZE
    targetZ = Math.round(targetZ / GRID_SIZE) * GRID_SIZE
    
    // Si aucun mouvement défini
    if (!moveDirection) {
      return
    }
    
    // Vérifier les limites
    if (!this.collisionManager.isWithinBounds(targetX, targetZ, PARKING_BOUNDS)) {
      // Deplacement hors limites
      this.selectedVehicle.flashCollision()
      return
    }
    
    // Vérifier les collisions
    if (this.collisionManager.checkCollision(this.selectedVehicle, targetX, targetZ)) {
      // Collision avec un autre vehicule
      this.selectedVehicle.flashCollision()
      return
    }
    
    // Sauvegarder la position actuelle avant le déplacement
    const fromX = currentPos.x
    const fromZ = currentPos.z
    
    // Déplacement valide
    this.selectedVehicle.moveTo(targetX, targetZ)
    
    // Mettre à jour la position du helper de direction
    if (this.directionHelper) {
      this.directionHelper.updatePosition(this.selectedVehicle)
    }
    
    // Notifier le scoring avec les positions et la direction exacte
    if (this.onMove) {
      this.onMove(this.selectedVehicle, fromX, fromZ, targetX, targetZ, exactDirection)
    }
  }
  
  /**
   * Met à jour le helper de direction (appelé dans la boucle d'animation)
   * @param {number} time - Temps écoulé pour l'animation de pulsation
   */
  update(time) {
    if (this.directionHelper && this.selectedVehicle) {
      this.directionHelper.updatePosition(this.selectedVehicle)
      this.directionHelper.pulse(time)
    }
  }
}
