/**
 * City Buildings Component
 * Procedurally generates 3D buildings around the railway
 */

import React, { useMemo } from 'react'
import * as THREE from 'three'

interface Building {
  position: [number, number, number]
  size: [number, number, number]
  color: string
}

interface CityBuildingsProps {
  count?: number
  area?: number
  nightMode?: boolean
  railwayPath?: [number, number][] // Path to avoid placing buildings on
}

const CityBuildings: React.FC<CityBuildingsProps> = ({
  count = 100,
  area = 80,
  nightMode = false,
  railwayPath = [],
}) => {
  // Generate building data
  const buildings = useMemo(() => {
    const result: Building[] = []
    const minDistance = 8 // Minimum distance from railway

    for (let i = 0; i < count; i++) {
      let x = (Math.random() - 0.5) * area * 2
      let z = (Math.random() - 0.5) * area

      // Check if position is too close to railway
      let tooClose = false
      for (const [rx, rz] of railwayPath) {
        const dist = Math.sqrt((x - rx) ** 2 + (z - rz) ** 2)
        if (dist < minDistance) {
          tooClose = true
          break
        }
      }

      if (tooClose) continue

      // Random building properties
      const width = Math.random() * 3 + 1
      const depth = Math.random() * 3 + 1
      const height = Math.random() * 8 + 2

      // Building color based on type
      const colorIndex = Math.floor(Math.random() * 5)
      const colors = nightMode
        ? ['#1a1a2e', '#16213e', '#1f2937', '#1e1e30', '#252540']
        : ['#4a5568', '#5a6779', '#6a778a', '#7a879a', '#8a97aa']

      result.push({
        position: [x, height / 2, z],
        size: [width, height, depth],
        color: colors[colorIndex],
      })
    }

    return result
  }, [count, area, nightMode, railwayPath])

  // Window lights for night mode
  const windowMaterial = useMemo(() => {
    if (!nightMode) return null

    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 128
    const ctx = canvas.getContext('2d')!

    // Dark building face
    ctx.fillStyle = '#0a0a15'
    ctx.fillRect(0, 0, 64, 128)

    // Random window lights
    const windowSize = 6
    const spacing = 10
    for (let y = 8; y < 120; y += spacing) {
      for (let x = 8; x < 56; x += spacing) {
        if (Math.random() > 0.4) {
          // Light on
          const warmth = Math.random()
          ctx.fillStyle =
            warmth > 0.5
              ? `rgba(255, 240, 200, ${0.7 + Math.random() * 0.3})`
              : `rgba(200, 230, 255, ${0.5 + Math.random() * 0.3})`
          ctx.fillRect(x, y, windowSize, windowSize)
        }
      }
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping

    return new THREE.MeshStandardMaterial({
      map: texture,
      emissive: new THREE.Color(0xffffff),
      emissiveMap: texture,
      emissiveIntensity: 0.5,
    })
  }, [nightMode])

  return (
    <group>
      {buildings.map((building, index) => (
        <group key={index} position={building.position}>
          {/* Main building body */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={building.size} />
            {nightMode && windowMaterial ? (
              <primitive object={windowMaterial.clone()} attach="material" />
            ) : (
              <meshStandardMaterial
                color={building.color}
                roughness={0.8}
                metalness={0.2}
              />
            )}
          </mesh>

          {/* Roof accent */}
          <mesh position={[0, building.size[1] / 2 + 0.1, 0]} castShadow>
            <boxGeometry
              args={[building.size[0] * 0.9, 0.2, building.size[2] * 0.9]}
            />
            <meshStandardMaterial
              color={nightMode ? '#2a2a4a' : '#3a4a5a'}
              roughness={0.6}
              metalness={0.3}
            />
          </mesh>

          {/* Rooftop details (random) */}
          {Math.random() > 0.5 && (
            <mesh
              position={[0, building.size[1] / 2 + 0.5, 0]}
              castShadow
            >
              <cylinderGeometry args={[0.3, 0.3, 0.8, 8]} />
              <meshStandardMaterial
                color={nightMode ? '#4a4a6a' : '#5a6a7a'}
                roughness={0.7}
              />
            </mesh>
          )}
        </group>
      ))}

      {/* Add some landmark tall buildings */}
      {[
        { pos: [30, 15, -20] as [number, number, number], height: 30 },
        { pos: [-20, 12, 15] as [number, number, number], height: 24 },
        { pos: [50, 10, 10] as [number, number, number], height: 20 },
      ].map((landmark, i) => (
        <group key={`landmark-${i}`} position={landmark.pos}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[4, landmark.height, 4]} />
            <meshStandardMaterial
              color={nightMode ? '#1a2040' : '#5a7090'}
              roughness={0.3}
              metalness={0.6}
              envMapIntensity={1}
            />
          </mesh>

          {/* Glass windows effect */}
          <mesh position={[0, 0, 2.01]}>
            <planeGeometry args={[3.8, landmark.height - 1]} />
            <meshStandardMaterial
              color={nightMode ? '#2a3a5a' : '#8ab4d4'}
              roughness={0.1}
              metalness={0.9}
              transparent
              opacity={0.8}
            />
          </mesh>

          {/* Beacon light on top for night */}
          {nightMode && (
            <pointLight
              position={[0, landmark.height / 2 + 1, 0]}
              color="#ff3333"
              intensity={0.5}
              distance={10}
            />
          )}
        </group>
      ))}
    </group>
  )
}

export default CityBuildings
