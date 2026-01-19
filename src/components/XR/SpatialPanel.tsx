/**
 * Spatial Panel Component
 * A 3D floating panel container for VR/AR UI elements
 */

import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Text } from '@react-three/drei'
import * as THREE from 'three'

interface SpatialPanelProps {
  id: string
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  width?: number
  height?: number
  isSelected?: boolean
  isLocked?: boolean
  title?: string
  onSelect?: () => void
  onMove?: (position: [number, number, number]) => void
  children?: React.ReactNode
}

const SpatialPanel: React.FC<SpatialPanelProps> = ({
  position,
  rotation = [0, 0, 0],
  scale = 1,
  width = 0.8,
  height = 0.6,
  isSelected = false,
  isLocked = false,
  title,
  onSelect,
  children,
}) => {
  const groupRef = useRef<THREE.Group>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Subtle floating animation
  useFrame(({ clock }) => {
    if (groupRef.current && !isLocked) {
      groupRef.current.position.y =
        position[1] + Math.sin(clock.elapsedTime * 0.5) * 0.02
    }
  })

  const borderColor = isSelected
    ? '#ff4081'
    : isHovered
    ? '#4fc3f7'
    : '#ffffff'

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={[scale, scale, scale]}
    >
      {/* Panel Background */}
      <RoundedBox
        args={[width, height, 0.02]}
        radius={0.02}
        smoothness={4}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        onClick={(e) => {
          e.stopPropagation()
          onSelect?.()
        }}
      >
        <meshStandardMaterial
          color="#1a1a2e"
          transparent
          opacity={0.9}
          metalness={0.1}
          roughness={0.8}
        />
      </RoundedBox>

      {/* Border Frame */}
      <lineSegments>
        <edgesGeometry
          args={[new THREE.BoxGeometry(width + 0.02, height + 0.02, 0.01)]}
        />
        <lineBasicMaterial color={borderColor} />
      </lineSegments>

      {/* Selection Indicator */}
      {isSelected && (
        <mesh position={[0, 0, 0.015]}>
          <planeGeometry args={[width + 0.04, height + 0.04]} />
          <meshBasicMaterial
            color="#ff4081"
            transparent
            opacity={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Lock Indicator */}
      {isLocked && (
        <group position={[width / 2 - 0.05, height / 2 - 0.05, 0.02]}>
          <mesh>
            <boxGeometry args={[0.03, 0.04, 0.01]} />
            <meshStandardMaterial color="#ffc107" />
          </mesh>
          <mesh position={[0, 0.025, 0]}>
            <torusGeometry args={[0.015, 0.003, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#ffc107" />
          </mesh>
        </group>
      )}

      {/* Title Bar */}
      {title && (
        <group position={[0, height / 2 - 0.04, 0.015]}>
          <mesh>
            <planeGeometry args={[width - 0.04, 0.05]} />
            <meshBasicMaterial color="#16213e" transparent opacity={0.8} />
          </mesh>
          <Text
            fontSize={0.025}
            color="#4fc3f7"
            anchorX="center"
            anchorY="middle"
            position={[0, 0, 0.001]}
          >
            {title}
          </Text>
        </group>
      )}

      {/* Content Container */}
      <group position={[0, title ? -0.03 : 0, 0.015]}>
        {children}
      </group>

      {/* Grab Handle (only when selected and not locked) */}
      {isSelected && !isLocked && (
        <group position={[0, -height / 2 - 0.03, 0]}>
          <mesh>
            <cylinderGeometry args={[0.015, 0.015, 0.04, 16]} />
            <meshStandardMaterial
              color="#4fc3f7"
              emissive="#4fc3f7"
              emissiveIntensity={0.3}
            />
          </mesh>
          <Text
            fontSize={0.015}
            color="#ffffff"
            anchorX="center"
            anchorY="top"
            position={[0, -0.03, 0]}
          >
            DRAG TO MOVE
          </Text>
        </group>
      )}
    </group>
  )
}

export default SpatialPanel
