import React, { useMemo, useRef, useState } from 'react'
import { Vector3, CatmullRomCurve3 } from 'three'
import { useFrame } from '@react-three/fiber'
import { Box, Text } from '@react-three/drei'
import { Train, Segment } from '@/types/railway'
import { useRailwayStore } from '@/stores/RailwayStore'

interface TrainModelProps {
  train: Train
  segment: Segment
}

const getTrainColor = (status: string, type: string): string => {
  if (status === 'maintenance') return '#ff5722'
  if (status === 'stopped') return '#9e9e9e'
  
  switch (type) {
    case 'express':
      return '#e91e63' // Pink for express
    case 'commuter':
    default:
      return '#3f51b5' // Blue for commuter
  }
}

const TrainModel: React.FC<TrainModelProps> = ({ train, segment }) => {
  const trainRef = useRef<any>()
  const [hovered, setHovered] = useState(false)
  const { openTrainDetail, setHoveredTrain } = useRailwayStore()

  // Create curve from segment points for train positioning
  const curve = useMemo(() => {
    const points = segment.points.map(p => new Vector3(p.x, p.y, p.z))
    return new CatmullRomCurve3(points)
  }, [segment.points])

  // Calculate train position and rotation along the curve
  const { position, rotation } = useMemo(() => {
    const t = train.direction === 'down' ? train.position : 1 - train.position
    const position = curve.getPoint(t)
    const tangent = curve.getTangent(t).normalize()
    
    // Calculate rotation based on direction
    const rotation = new Vector3()
    rotation.y = Math.atan2(tangent.x, tangent.z)
    
    // Adjust height slightly above track
    position.y += 0.3
    
    return { position, rotation }
  }, [curve, train.position, train.direction])

  const trainColor = getTrainColor(train.status, train.type)

  const handleClick = (e: any) => {
    e.stopPropagation()
    openTrainDetail(train.id)
  }

  const handlePointerEnter = (e: any) => {
    e.stopPropagation()
    setHovered(true)
    setHoveredTrain(train)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerLeave = (e: any) => {
    e.stopPropagation()
    setHovered(false)
    setHoveredTrain(null)
    document.body.style.cursor = 'auto'
  }

  return (
    <group
      ref={trainRef}
      position={position}
      rotation={[0, rotation.y, 0]}
    >
      {/* Main Train Body */}
      <Box
        args={[1.5, 0.6, 0.4]}
        position={[0, 0, 0]}
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <meshStandardMaterial
          color={trainColor}
          emissive={trainColor}
          emissiveIntensity={hovered ? 0.3 : 0.1}
          transparent={true}
          opacity={hovered ? 0.9 : 0.8}
          roughness={0.2}
          metalness={0.7}
        />
      </Box>

      {/* Train Front */}
      <Box
        args={[0.2, 0.4, 0.3]}
        position={[0.85, 0, 0]}
      >
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.2}
        />
      </Box>

      {/* Train Windows */}
      <Box
        args={[1.2, 0.15, 0.41]}
        position={[0, 0.15, 0]}
      >
        <meshStandardMaterial
          color="#87ceeb"
          transparent={true}
          opacity={0.6}
        />
      </Box>

      {/* Train Label (visible when hovered) */}
      {hovered && (
        <Text
          position={[0, 0.8, 0]}
          fontSize={0.2}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          {train.name}
        </Text>
      )}

      {/* Speed/Status Indicator */}
      {(train.status !== 'running' || hovered) && (
        <Text
          position={[0, -0.5, 0]}
          fontSize={0.15}
          color="#ffff00"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          {train.status === 'stopped' ? 'STOPPED' : 
           train.status === 'maintenance' ? 'MAINTENANCE' :
           `${Math.round(train.speed)}km/h`}
        </Text>
      )}
    </group>
  )
}

export default TrainModel