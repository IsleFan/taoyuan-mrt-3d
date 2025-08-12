import React, { useMemo, useRef, useState } from 'react'
import { Vector3, CatmullRomCurve3 } from 'three'
import { Box, Text, RoundedBox } from '@react-three/drei'
import { Train, Segment } from '@/types/railway'
import { useRailwayStore } from '@/stores/RailwayStore'

interface TrainModelProps {
  train: Train
  segment: Segment
}

// 桃園機場捷運的實際配色
const getTaoyuanMRTColors = (type: string) => {
  switch (type) {
    case 'express':
      return {
        primary: '#8B2635', // 深紅酒色 (直達車)
        secondary: '#FFFFFF', // 白色
        accent: '#FFD700' // 金色裝飾
      }
    case 'commuter':
    default:
      return {
        primary: '#003f7f', // 深藍色 (普通車)
        secondary: '#FFFFFF', // 白色
        accent: '#87CEEB' // 淺藍色裝飾
      }
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
    const t = train.direction === 'down' ? 1 - train.position : train.position
    const position = curve.getPoint(t)
    const tangent = curve.getTangent(t).normalize()
    
    // Calculate rotation based on direction and tangent
    const rotation = new Vector3()
    if (train.direction === 'down') {
      // For down direction, reverse the tangent and add 90 degrees
      rotation.y = Math.atan2(-tangent.x, -tangent.z) + Math.PI / 2
    } else {
      // For up direction, use normal tangent and add 90 degrees
      rotation.y = Math.atan2(tangent.x, tangent.z) + Math.PI / 2
    }
    
    // Adjust height slightly above track
    position.y += 0.3
    
    return { position, rotation }
  }, [curve, train.position, train.direction])

  const trainColors = getTaoyuanMRTColors(train.type)

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
      onClick={handleClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {/* 列車主體底盤 */}
      <RoundedBox
        args={[3.0, 0.8, 0.6]}
        radius={0.05}
        smoothness={4}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial
          color={train.status === 'maintenance' ? '#666666' : trainColors.primary}
          emissive={train.status === 'maintenance' ? '#333333' : trainColors.primary}
          emissiveIntensity={hovered ? 0.15 : 0.05}
          roughness={0.1}
          metalness={0.8}
        />
      </RoundedBox>

      {/* 列車上半部白色車身 */}
      <RoundedBox
        args={[2.8, 0.4, 0.55]}
        radius={0.08}
        smoothness={4}
        position={[0, 0.3, 0]}
      >
        <meshStandardMaterial
          color={trainColors.secondary}
          roughness={0.05}
          metalness={0.2}
        />
      </RoundedBox>

      {/* 車頭 (流線型設計) */}
      <RoundedBox
        args={[0.4, 0.7, 0.5]}
        radius={0.15}
        smoothness={8}
        position={[1.4, 0.1, 0]}
      >
        <meshStandardMaterial
          color={trainColors.primary}
          roughness={0.1}
          metalness={0.9}
        />
      </RoundedBox>

      {/* 車頭燈 */}
      <Box
        args={[0.1, 0.15, 0.15]}
        position={[1.65, 0.2, -0.15]}
      >
        <meshStandardMaterial
          color="#FFFFFF"
          emissive="#FFFF80"
          emissiveIntensity={0.5}
        />
      </Box>
      <Box
        args={[0.1, 0.15, 0.15]}
        position={[1.65, 0.2, 0.15]}
      >
        <meshStandardMaterial
          color="#FFFFFF"
          emissive="#FFFF80"
          emissiveIntensity={0.5}
        />
      </Box>

      {/* 車窗 (多個分段窗戶) */}
      {[-0.8, -0.4, 0, 0.4, 0.8].map((x, index) => (
        <Box
          key={index}
          args={[0.3, 0.25, 0.02]}
          position={[x, 0.35, 0.29]}
        >
          <meshStandardMaterial
            color="#4A90E2"
            transparent={true}
            opacity={0.7}
            roughness={0}
            metalness={0}
          />
        </Box>
      ))}

      {/* 車門 */}
      <Box
        args={[0.4, 0.6, 0.02]}
        position={[-1.0, 0.1, 0.29]}
      >
        <meshStandardMaterial
          color={trainColors.primary}
          roughness={0.3}
          metalness={0.5}
        />
      </Box>
      <Box
        args={[0.4, 0.6, 0.02]}
        position={[1.0, 0.1, 0.29]}
      >
        <meshStandardMaterial
          color={trainColors.primary}
          roughness={0.3}
          metalness={0.5}
        />
      </Box>

      {/* 車底轉向架 */}
      <Box
        args={[0.6, 0.2, 0.4]}
        position={[-0.8, -0.5, 0]}
      >
        <meshStandardMaterial
          color="#333333"
          roughness={0.8}
          metalness={0.1}
        />
      </Box>
      <Box
        args={[0.6, 0.2, 0.4]}
        position={[0.8, -0.5, 0]}
      >
        <meshStandardMaterial
          color="#333333"
          roughness={0.8}
          metalness={0.1}
        />
      </Box>

      {/* 路線標識 */}
      {train.type === 'express' && (
        <Box
          args={[0.8, 0.2, 0.02]}
          position={[0, 0.45, 0.31]}
        >
          <meshStandardMaterial
            color="#8B2635"
            emissive="#FFD700"
            emissiveIntensity={0.2}
          />
        </Box>
      )}

      {/* 車廂編號標識 */}
      <Text
        position={[0, 0.6, 0.31]}
        fontSize={0.12}
        color={trainColors.primary}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#FFFFFF"
      >
        {train.type === 'express' ? '直達' : '普通'}
      </Text>

      {/* 懸停時的資訊 */}
      {hovered && (
        <Text
          position={[0, 1.2, 0]}
          fontSize={0.18}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {train.name}
        </Text>
      )}

      {/* 狀態指示器 */}
      {(train.status !== 'running' || hovered) && (
        <Text
          position={[0, -0.8, 0]}
          fontSize={0.12}
          color={train.status === 'maintenance' ? '#FF5722' : 
                train.status === 'stopped' ? '#FFC107' : '#4CAF50'}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          {train.status === 'stopped' ? '停駛中' : 
           train.status === 'maintenance' ? '維修中' :
           `${Math.round(train.speed)} km/h`}
        </Text>
      )}

      {/* 運行方向指示燈 */}
      <Box
        args={[0.1, 0.1, 0.02]}
        position={[train.direction === 'up' ? 1.3 : -1.3, 0.5, 0.31]}
      >
        <meshStandardMaterial
          color={train.status === 'running' ? '#00FF00' : '#FF0000'}
          emissive={train.status === 'running' ? '#00FF00' : '#FF0000'}
          emissiveIntensity={0.5}
        />
      </Box>
    </group>
  )
}

export default TrainModel