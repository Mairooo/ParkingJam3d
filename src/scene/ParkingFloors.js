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
    this.parkingInstances = [] // Stocker les instances pour optimisation
    this.loader = new GLTFLoader()
    this.tgaLoader = new TGALoader()
    this.textures = {}
    
    this.loadTextures().then(() => {
      this.loadParkingModelInstanced()
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
  
  loadParkingModelInstanced() {
    // Charger le parking UNE SEULE FOIS puis créer des instances
    const floorYPositions = [0, -3.0, -6.0]
    
    this.loader.load(
      '/models/parking.glb',
      (gltf) => {
        const originalParking = gltf.scene
        
        // Valeurs ajustées
        const scale = 0.01
        const offsetX = 4.5
        const offsetZ = -10
        const rotationY = Math.PI
        
        // Parcourir chaque mesh et créer des InstancedMesh
        const meshesToInstance = []
        
        originalParking.traverse((child) => {
          if (child.isMesh) {
            meshesToInstance.push({
              geometry: child.geometry,
              material: child.material,
              name: child.name,
              localMatrix: child.matrix.clone(),
              position: child.position.clone(),
              rotation: child.rotation.clone(),
              scale: child.scale.clone()
            })
          }
        })
        
        // Pour chaque mesh, créer un InstancedMesh avec 3 instances
        meshesToInstance.forEach((meshData) => {
          const instancedMesh = new THREE.InstancedMesh(
            meshData.geometry,
            meshData.material,
            floorYPositions.length // 3 instances
          )
          
          // Appliquer les textures selon le nom
          const name = meshData.name.toLowerCase()
          if (name.includes('floor') || name.includes('sol')) {
            this.applyTextures(instancedMesh, 'floor')
          } else if (name.includes('wall') || name.includes('mur')) {
            this.applyTextures(instancedMesh, 'wall')
          } else if (name.includes('ceiling') || name.includes('plafond')) {
            this.applyTextures(instancedMesh, 'ceiling')
          } else if (name.includes('piller') || name.includes('pillar') || name.includes('pilier')) {
            this.applyTextures(instancedMesh, 'piller')
          } else if (name.includes('door') || name.includes('porte')) {
            this.applyTextures(instancedMesh, 'door')
          } else if (name.includes('duct') || name.includes('conduit') || name.includes('pipe')) {
            this.applyTextures(instancedMesh, 'duct')
          } else if (name.includes('prop') || name.includes('object')) {
            this.applyTextures(instancedMesh, 'props')
          } else {
            this.applyTextures(instancedMesh, 'wall')
          }
          
          // Configurer chaque instance (une par étage)
          const matrix = new THREE.Matrix4()
          const position = new THREE.Vector3()
          const quaternion = new THREE.Quaternion()
          const scaleVec = new THREE.Vector3()
          
          floorYPositions.forEach((floorY, index) => {
            // Position de base du mesh + offset de l'étage
            position.set(
              meshData.position.x * scale + offsetX,
              meshData.position.y * scale + floorY,
              meshData.position.z * scale + offsetZ
            )
            
            // Rotation
            quaternion.setFromEuler(new THREE.Euler(
              meshData.rotation.x,
              meshData.rotation.y + rotationY,
              meshData.rotation.z
            ))
            
            // Échelle
            scaleVec.set(
              meshData.scale.x * scale,
              meshData.scale.y * scale,
              meshData.scale.z * scale
            )
            
            matrix.compose(position, quaternion, scaleVec)
            instancedMesh.setMatrixAt(index, matrix)
          })
          
          instancedMesh.instanceMatrix.needsUpdate = true
          instancedMesh.castShadow = true
          instancedMesh.receiveShadow = true
          instancedMesh.frustumCulled = true // Activer explicitement le frustum culling
          
          this.scene.add(instancedMesh)
          this.parkingInstances.push(instancedMesh)
        })
        
        // Stocker une référence pour le GUI
        this.parkingModel = { position: new THREE.Vector3(offsetX, 0, offsetZ) }
        
        console.log(`✅ Parking loaded with ${meshesToInstance.length} instanced meshes (${floorYPositions.length} floors each)`)
        console.log(`📊 Optimisation: ${meshesToInstance.length * floorYPositions.length} objets → ${meshesToInstance.length} draw calls`)
      },
      (progress) => {
        console.log(`Loading parking...`, (progress.loaded / progress.total * 100).toFixed(0) + '%')
      },
      (error) => {
        console.error('❌ Error loading parking model:', error)
      }
    )
  }
  
  // Ancienne méthode gardée pour compatibilité
  loadParkingModel() {
    this.loadParkingModelInstanced()
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
