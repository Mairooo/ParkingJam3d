# ParkingJam3D

Jeu de puzzle 3D inspiré de Rush Hour, développé avec Three.js.

## Jouer en ligne

**[Jouer sur GitHub Pages](https://mairooo.github.io/ParkingJam3d/)**

## Dépôt GitHub

**[https://github.com/Mairooo/ParkingJam3d](https://github.com/Mairooo/ParkingJam3d)**

## Installation locale

```bash
# Cloner le projet
git clone https://github.com/Mairooo/ParkingJam3d.git
cd ParkingJam3d

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Le jeu sera accessible sur `http://localhost:5173/`

## Comment jouer

1. **Cliquer sur le taxi** (jaune) pour le sélectionner
2. **Utiliser les flèches directionnelles** pour déplacer les véhicules
3. **Touche E** pour utiliser les ascenseurs
4. **Touche C** pour changer de caméra
5. **Objectif** : Sortir le taxi du parking en déplaçant les autres véhicules

## Technologies

- [Three.js](https://threejs.org/) - Moteur 3D
- [Vite](https://vitejs.dev/) - Build tool
- [lil-gui](https://lil-gui.georgealways.com/) - Interface de contrôle

## Structure du projet

```
src/
├── main.js              # Point d'entrée
├── style.css            # Styles
├── controls/            # Gestion des inputs
├── game/                # Logique de jeu (niveaux, collisions, score)
├── objects/             # Objets 3D (véhicules, ascenseurs, sortie)
├── scene/               # Scène du parking
└── utils/               # Constantes et utilitaires
```

## Auteur

Maïro FEBOURG - Projet universitaire Three.js 2025-2026
