import * as THREE from 'three'
import { DIRECTIONS, GRID_SIZE, PARKING_BOUNDS } from '../utils/constants.js'

/**
 * Helper visuel affichant les flèches de direction possibles
 * pour un véhicule sélectionné
 */
export class DirectionHelper {
  constructor() {
    this.group = new THREE.Group()
    this.arrows = []
    this.visible = false
    
    // Couleurs des flèches
    this.colors = {
      horizontal: 0x00aaff,  // Bleu pour gauche/droite
      vertical: 0x00ff88     // Vert pour haut/bas
    }
    
    // Créer les 4 flèches (on affichera seulement celles nécessaires)
    this.createArrows()
  }
  
  createArrows() {
    // Position par défaut (sera ajustée dynamiquement selon la taille du véhicule)
    
    // Flèche HAUT (vers -Z)
    const upArrow = this.createArrow(
      new THREE.Vector3(0, 0, -2.0),
      new THREE.Vector3(0, 0, -1),
      this.colors.vertical,
      'up'
    )
    upArrow.userData.direction = 'vertical'
    upArrow.userData.key = '↑ Z'
    this.arrows.push(upArrow)
    this.group.add(upArrow)
    
    // Flèche BAS (vers +Z)
    const downArrow = this.createArrow(
      new THREE.Vector3(0, 0, 2.0),
      new THREE.Vector3(0, 0, 1),
      this.colors.vertical,
      'down'
    )
    downArrow.userData.direction = 'vertical'
    downArrow.userData.key = '↓ S'
    this.arrows.push(downArrow)
    this.group.add(downArrow)
    
    // Flèche GAUCHE (vers -X)
    const leftArrow = this.createArrow(
      new THREE.Vector3(-2.0, 0, 0),
      new THREE.Vector3(-1, 0, 0),
      this.colors.horizontal,
      'left'
    )
    leftArrow.userData.direction = 'horizontal'
    leftArrow.userData.key = '← Q'
    this.arrows.push(leftArrow)
    this.group.add(leftArrow)
    
    // Flèche DROITE (vers +X)
    const rightArrow = this.createArrow(
      new THREE.Vector3(2.0, 0, 0),
      new THREE.Vector3(1, 0, 0),
      this.colors.horizontal,
      'right'
    )
    rightArrow.userData.direction = 'horizontal'
    rightArrow.userData.key = '→ D'
    this.arrows.push(rightArrow)
    this.group.add(rightArrow)
    
    // Cacher par défaut
    this.group.visible = false
  }
  
  createArrow(position, direction, color, name) {
    const group = new THREE.Group()
    group.name = name
    
    // Corps de la flèche (cylindre)
    const bodyLength = 0.6
    const bodyGeometry = new THREE.CylinderGeometry(0.08, 0.08, bodyLength, 8)
    const bodyMaterial = new THREE.MeshBasicMaterial({ 
      color: color,
      transparent: true,
      opacity: 0.9
    })
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
    
    // Tête de la flèche (cône)
    const headGeometry = new THREE.ConeGeometry(0.2, 0.4, 8)
    const headMaterial = new THREE.MeshBasicMaterial({ 
      color: color,
      transparent: true,
      opacity: 0.9
    })
    const head = new THREE.Mesh(headGeometry, headMaterial)
    
    // Positionner le corps et la tête (décalés du véhicule)
    const offset = 0.5  // Décalage depuis le bord du véhicule
    
    if (Math.abs(direction.z) > 0) {
      // Flèches verticales (Z)
      body.rotation.x = Math.PI / 2
      body.position.z = direction.z * (bodyLength / 2 + offset)
      head.rotation.x = direction.z > 0 ? Math.PI / 2 : -Math.PI / 2
      head.position.z = direction.z * (bodyLength + offset + 0.25)
    } else {
      // Flèches horizontales (X)
      body.rotation.z = Math.PI / 2
      body.position.x = direction.x * (bodyLength / 2 + offset)
      head.rotation.z = direction.x > 0 ? -Math.PI / 2 : Math.PI / 2
      head.position.x = direction.x * (bodyLength + offset + 0.25)
    }
    
    group.add(body)
    group.add(head)
    
    // Ajouter un label avec la touche (sprite texte)
    const label = this.createLabel(direction, color)
    group.add(label)
    
    return group
  }
  
  createLabel(direction, color) {
    // Créer un canvas pour le texte
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')
    
    // Fond semi-transparent
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
    ctx.beginPath()
    ctx.arc(32, 32, 28, 0, Math.PI * 2)
    ctx.fill()
    
    // Bordure colorée
    ctx.strokeStyle = '#' + color.toString(16).padStart(6, '0')
    ctx.lineWidth = 3
    ctx.stroke()
    
    // Texte de la touche
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 28px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    let keyText = ''
    if (direction.z < 0) keyText = 'Z'
    else if (direction.z > 0) keyText = 'S'
    else if (direction.x < 0) keyText = 'Q'
    else if (direction.x > 0) keyText = 'D'
    
    ctx.fillText(keyText, 32, 32)
    
    // Créer le sprite
    const texture = new THREE.CanvasTexture(canvas)
    const spriteMaterial = new THREE.SpriteMaterial({ 
      map: texture,
      transparent: true,
      depthTest: false
    })
    const sprite = new THREE.Sprite(spriteMaterial)
    sprite.scale.set(0.6, 0.6, 1)
    
    // Positionner le label au bout de la flèche
    const offset = 2.0
    if (direction.z < 0) sprite.position.set(0, 0.5, -offset)
    else if (direction.z > 0) sprite.position.set(0, 0.5, offset)
    else if (direction.x < 0) sprite.position.set(-offset, 0.5, 0)
    else if (direction.x > 0) sprite.position.set(offset, 0.5, 0)
    
    return sprite
  }
  
  /**
   * Vérifie si un mouvement dans une direction est possible
   * @param {Vehicle} vehicle - Le véhicule à déplacer
   * @param {string} arrowDirection - Direction de la flèche ('up', 'down', 'left', 'right')
   * @param {CollisionManager} collisionManager - Le gestionnaire de collisions
   * @returns {boolean} - true si le mouvement est possible
   */
  canMoveInDirection(vehicle, arrowDirection, collisionManager) {
    if (!collisionManager) return true
    
    const pos = vehicle.getPosition()
    let targetX = pos.x
    let targetZ = pos.z
    
    // Calculer la position cible selon la direction
    switch (arrowDirection) {
      case 'up':
        targetZ = pos.z - GRID_SIZE
        break
      case 'down':
        targetZ = pos.z + GRID_SIZE
        break
      case 'left':
        targetX = pos.x - GRID_SIZE
        break
      case 'right':
        targetX = pos.x + GRID_SIZE
        break
    }
    
    // Vérifier les limites du parking
    if (targetX < PARKING_BOUNDS.minX || targetX > PARKING_BOUNDS.maxX ||
        targetZ < PARKING_BOUNDS.minZ || targetZ > PARKING_BOUNDS.maxZ) {
      return false
    }
    
    // Vérifier les collisions avec d'autres véhicules
    return !collisionManager.checkCollision(vehicle, targetX, targetZ)
  }
  
  /**
   * Affiche les flèches pour un véhicule donné
   * @param {Vehicle} vehicle - Le véhicule sélectionné
   * @param {THREE.Scene} scene - La scène Three.js
   * @param {CollisionManager} collisionManager - Le gestionnaire de collisions (optionnel)
   */
  show(vehicle, scene, collisionManager = null) {
    const pos = vehicle.getPosition()
    const direction = vehicle.direction
    
    // Calculer la taille du véhicule pour adapter l'espacement
    const bbox = new THREE.Box3().setFromObject(vehicle.model)
    const size = new THREE.Vector3()
    bbox.getSize(size)
    
    // Mettre à jour la position des flèches avec un espacement adapté
    this.arrows.forEach(arrow => {
      const basePos = { x: 0, y: 0, z: 0 }
      const arrowDir = arrow.name
      
      if (arrowDir === 'up') {
        basePos.z = -(size.z / 2 + 0)
      } else if (arrowDir === 'down') {
        basePos.z = (size.z / 2 + 0)
      } else if (arrowDir === 'left') {
        basePos.x = -(size.x / 2 + 0)
      } else if (arrowDir === 'right') {
        basePos.x = (size.x / 2 + 0)
      }
      
      arrow.position.set(basePos.x, basePos.y, basePos.z)
    })
    
    // Positionner le groupe au-dessus du véhicule
    this.group.position.set(pos.x, pos.y + 0.8, pos.z)
    
    // Afficher seulement les flèches correspondant à la direction du véhicule
    // ET seulement si le mouvement est possible (pas de collision)
    this.arrows.forEach(arrow => {
      let shouldShow = false
      
      // Vérifier si la direction correspond au véhicule
      if (direction === DIRECTIONS.BOTH) {
        shouldShow = true
      } else if (direction === DIRECTIONS.HORIZONTAL) {
        shouldShow = arrow.userData.direction === 'horizontal'
      } else if (direction === DIRECTIONS.VERTICAL) {
        shouldShow = arrow.userData.direction === 'vertical'
      }
      
      // Vérifier si le mouvement est possible (pas de collision)
      if (shouldShow && collisionManager) {
        shouldShow = this.canMoveInDirection(vehicle, arrow.name, collisionManager)
      }
      
      arrow.visible = shouldShow
    })
    
    // Ajouter à la scène si pas encore fait
    if (!this.group.parent) {
      scene.add(this.group)
    }
    
    this.group.visible = true
    this.visible = true
  }
  
  /**
   * Cache les flèches
   */
  hide() {
    this.group.visible = false
    this.visible = false
  }
  
  /**
   * Met à jour la position des flèches (si le véhicule bouge)
   * @param {Vehicle} vehicle - Le véhicule à suivre
   */
  updatePosition(vehicle) {
    if (!this.visible || !vehicle) return
    
    const pos = vehicle.getPosition()
    this.group.position.set(pos.x, pos.y + 0.8, pos.z)
  }
  
  /**
   * Animation de pulsation pour attirer l'attention
   */
  pulse(time) {
    if (!this.visible) return
    
    const scale = 1 + Math.sin(time * 3) * 0.1
    this.arrows.forEach(arrow => {
      if (arrow.visible) {
        arrow.scale.set(scale, scale, scale)
      }
    })
  }
}
