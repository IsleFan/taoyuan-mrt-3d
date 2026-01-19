/**
 * Realistic Ground Component
 * Creates a map-like ground with roads and terrain
 */

import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface RealisticGroundProps {
  size?: number
  showGrid?: boolean
  nightMode?: boolean
}

const RealisticGround: React.FC<RealisticGroundProps> = ({
  size = 200,
  showGrid = true,
  nightMode = false,
}) => {
  const waterRef = useRef<THREE.Mesh>(null)

  // Create ground texture procedurally
  const groundMaterial = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 1024
    const ctx = canvas.getContext('2d')!

    // Base color - dark greenish gray for land
    ctx.fillStyle = nightMode ? '#0d1a12' : '#2a3a2a'
    ctx.fillRect(0, 0, 1024, 1024)

    // Add noise pattern for terrain variation
    const imageData = ctx.getImageData(0, 0, 1024, 1024)
    for (let i = 0; i < imageData.data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 20
      imageData.data[i] += noise
      imageData.data[i + 1] += noise
      imageData.data[i + 2] += noise
    }
    ctx.putImageData(imageData, 0, 0)

    // Draw major roads
    ctx.strokeStyle = nightMode ? '#1a1a1a' : '#404040'
    ctx.lineWidth = 12

    // Horizontal roads
    for (let y = 100; y < 1024; y += 200) {
      ctx.beginPath()
      ctx.moveTo(0, y + Math.random() * 20)
      ctx.lineTo(1024, y + Math.random() * 20)
      ctx.stroke()
    }

    // Vertical roads
    for (let x = 100; x < 1024; x += 250) {
      ctx.beginPath()
      ctx.moveTo(x + Math.random() * 20, 0)
      ctx.lineTo(x + Math.random() * 20, 1024)
      ctx.stroke()
    }

    // Draw minor roads
    ctx.strokeStyle = nightMode ? '#151515' : '#3a3a3a'
    ctx.lineWidth = 4

    for (let i = 0; i < 20; i++) {
      ctx.beginPath()
      ctx.moveTo(Math.random() * 1024, Math.random() * 1024)
      ctx.lineTo(Math.random() * 1024, Math.random() * 1024)
      ctx.stroke()
    }

    // Add building blocks (darker squares)
    ctx.fillStyle = nightMode ? '#0a0f0a' : '#1f2f1f'
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 900 + 50
      const y = Math.random() * 900 + 50
      const w = Math.random() * 60 + 20
      const h = Math.random() * 60 + 20
      ctx.fillRect(x, y, w, h)
    }

    // Add some parks/green areas
    ctx.fillStyle = nightMode ? '#0f1f0f' : '#2d4a2d'
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * 800 + 100
      const y = Math.random() * 800 + 100
      const r = Math.random() * 40 + 20
      ctx.beginPath()
      ctx.ellipse(x, y, r, r * 0.8, 0, 0, Math.PI * 2)
      ctx.fill()
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(4, 4)

    return new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.9,
      metalness: 0.1,
      side: THREE.DoubleSide,
    })
  }, [nightMode])

  // Create water areas (for coastal/river effect)
  const waterMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: nightMode ? '#0a1520' : '#1a4060',
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.8,
    })
  }, [nightMode])

  // Animate water
  useFrame((state) => {
    if (waterRef.current) {
      waterRef.current.position.y = -0.3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05
    }
  })

  // Grid overlay for futuristic look
  const gridMaterial = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')!

    ctx.fillStyle = 'transparent'
    ctx.fillRect(0, 0, 512, 512)

    // Grid lines
    ctx.strokeStyle = nightMode ? 'rgba(79, 195, 247, 0.15)' : 'rgba(79, 195, 247, 0.08)'
    ctx.lineWidth = 1

    // Major grid
    for (let i = 0; i <= 512; i += 64) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, 512)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(512, i)
      ctx.stroke()
    }

    // Minor grid
    ctx.strokeStyle = nightMode ? 'rgba(79, 195, 247, 0.08)' : 'rgba(79, 195, 247, 0.04)'
    for (let i = 0; i <= 512; i += 16) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, 512)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(512, i)
      ctx.stroke()
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(20, 20)

    return new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
    })
  }, [nightMode])

  return (
    <group>
      {/* Main ground plane */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.1, 0]}
        receiveShadow
      >
        <planeGeometry args={[size, size, 1, 1]} />
        <primitive object={groundMaterial} attach="material" />
      </mesh>

      {/* Grid overlay */}
      {showGrid && (
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.01, 0]}
        >
          <planeGeometry args={[size, size, 1, 1]} />
          <primitive object={gridMaterial} attach="material" />
        </mesh>
      )}

      {/* Water body on the side (Taiwan Strait/ocean) */}
      <mesh
        ref={waterRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[-size / 2 - 20, -0.3, 0]}
        receiveShadow
      >
        <planeGeometry args={[60, size, 1, 1]} />
        <primitive object={waterMaterial} attach="material" />
      </mesh>
    </group>
  )
}

export default RealisticGround
