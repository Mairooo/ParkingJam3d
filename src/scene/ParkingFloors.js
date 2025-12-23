import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader.js'
import { COLORS, FLOORS } from '../utils/constants.js'

export class ParkingFloors {
  constructor(scene) {
    this.scene = scene
    this.floors = []
    this.pillars = []
    this.grids = []  // Stocker les grilles pour le toggle
    this.parkingModel = null
    this.loader = new GLTFLoader()
    this.tgaLoader = new TGALoader()
    this.textures = {}
    
    this.loadTextures().then(() => {
      this.loadParkingModel()
    })
    this.createFloors()
    this.createPillars()
  }
  
  loadTextures() {
    return new Promise((resolve) => {
      const textureFiles = {
        // Diffuse maps (couleur)
        floorD: '/textures/FloorD.tga',
        wallD: '/textures/WallD.tga',
        ceilingD: '/textures/CeilingD.tga',
        pillerD: '/textures/PillerD.tga',
        doorD: '/textures/DoorD.tga',
        ductD: '/textures/DuctD.tga',
        propsD: '/textures/PropsD.tga',
        metalD: '/textures/Metal.tga',
        // Normal maps
        floorN: '/textures/FloorN.tga',
        wallN: '/textures/WallN.tga',
        ceilingN: '/textures/CeilingN.tga',
        pillerN: '/textures/PillerN.tga',
        doorN: '/textures/DoorN.tga',
        ductN: '/textures/DuctN.tga',
        propsN: '/textures/PropsN.tga',
        // AO maps
        floorAO: '/textures/FloorAo.tga',
        wallAO: '/textures/WallAO.tga',
        ceilingAO: '/textures/CeilingAO.tga',
        pillerAO: '/textures/PillerAO.tga',
      }
      
      let loaded = 0
      const total = Object.keys(textureFiles).length
      
      Object.entries(textureFiles).forEach(([name, path]) => {
        this.tgaLoader.load(
          path,
          (texture) => {
            texture.colorSpace = THREE.SRGBColorSpace
            texture.wrapS = THREE.RepeatWrapping
            texture.wrapT = THREE.RepeatWrapping
            this.textures[name] = texture
            loaded++
            console.log(`Loaded texture: ${name} (${loaded}/${total})`)
            if (loaded >= total) resolve()
          },
          undefined,
          (error) => {
            console.warn(`Could not load texture: ${path}`)
            loaded++
            if (loaded >= total) resolve()
          }
        )
      })
    })
  }
  
  loadParkingModel() {
    // Charger le parking 3 fois pour les 3 étages
    const floorYPositions = [0, -3.0, -6.0] // Y=0, Y=-3.0, Y=-6.0
    
    floorYPositions.forEach((floorY, index) => {
      this.loader.load(
        '/models/parking.glb',
        (gltf) => {
          const parkingClone = gltf.scene
          
          // Valeurs ajustées par l'utilisateur
          const scale = 0.01
          const offsetX = 4.5
          const offsetZ = -10
          const rotationY = Math.PI // ~3.15
          
          parkingClone.scale.set(scale, scale, scale)
          parkingClone.position.set(offsetX, floorY, offsetZ)
          parkingClone.rotation.y = rotationY
          
          // Appliquer les textures aux meshes selon leur nom
          parkingClone.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true
              child.receiveShadow = true
              
              const name = child.name.toLowerCase()
              
              // Appliquer les textures selon le nom du mesh
              if (name.includes('floor') || name.includes('sol')) {
                this.applyTextures(child, 'floor')
              } else if (name.includes('wall') || name.includes('mur')) {
                this.applyTextures(child, 'wall')
              } else if (name.includes('ceiling') || name.includes('plafond')) {
                this.applyTextures(child, 'ceiling')
              } else if (name.includes('piller') || name.includes('pillar') || name.includes('pilier')) {
                this.applyTextures(child, 'piller')
              } else if (name.includes('door') || name.includes('porte')) {
                this.applyTextures(child, 'door')
              } else if (name.includes('duct') || name.includes('conduit') || name.includes('pipe')) {
                this.applyTextures(child, 'duct')
              } else if (name.includes('prop') || name.includes('object')) {
                this.applyTextures(child, 'props')
              } else {
                // Texture par défaut pour les autres meshes
                this.applyTextures(child, 'wall')
              }
            }
          })
          
          this.scene.add(parkingClone)
          
          // Stocker la référence du premier étage pour le GUI
          if (index === 0) {
            this.parkingModel = parkingClone
          }
          
          console.log(`✅ Parking floor ${index} loaded at Y=${floorY}`)
        },
        (progress) => {
          console.log(`Loading parking floor ${index}...`, (progress.loaded / progress.total * 100).toFixed(0) + '%')
        },
        (error) => {
          console.error('❌ Error loading parking model:', error)
        }
      )
    })
  }
  
  applyTextures(mesh, type) {
    const diffuse = this.textures[`${type}D`]
    const normal = this.textures[`${type}N`]
    const ao = this.textures[`${type}AO`]
    
    if (diffuse) {
      mesh.material = new THREE.MeshStandardMaterial({
        map: diffuse,
        normalMap: normal || null,
        aoMap: ao || null,
        roughness: 0.8,
        metalness: 0.1
      })
    }
  }
  
  createFloors() {
    FLOORS.forEach((floorData, index) => {
      // Sol de l'étage (plan invisible pour la logique de jeu)
      const floorGeometry = new THREE.PlaneGeometry(20, 20)
      const floorMaterial = new THREE.MeshStandardMaterial({ 
        color: index === 0 ? COLORS.floor : (index === 1 ? COLORS.floorLevel1 : COLORS.floorLevel2),
        roughness: 0.8,
        metalness: 0.2,
        transparent: true,
        opacity: 0.0  // Invisible car on utilise le modèle 3D
      })
      const floor = new THREE.Mesh(floorGeometry, floorMaterial)
      floor.rotation.x = -Math.PI / 2
      floor.position.y = floorData.y
      floor.receiveShadow = true
      floor.userData.floorLevel = floorData.level
      this.scene.add(floor)
      
      // Grille de repères pour chaque étage
      const gridHelper = new THREE.GridHelper(20, 20, COLORS.grid, COLORS.gridCenter)
      gridHelper.position.y = floorData.y + 0.01
      this.scene.add(gridHelper)
      this.grids.push(gridHelper)  // Stocker la grille
      
      this.floors.push({ mesh: floor, data: floorData })
    })
  }
  
  createPillars() {
    // Les piliers sont maintenant dans le modèle 3D
    // On garde cette méthode vide pour la compatibilité
  }
  
  getFloorYByLevel(level) {
    const floor = FLOORS.find(f => f.level === level)
    return floor ? floor.y : 0
  }
  
  toggleGrids(visible) {
    this.grids.forEach(grid => {
      grid.visible = visible
    })
  }
}
