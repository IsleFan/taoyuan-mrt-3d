/**
 * 3D Train Detail Panel for VR/AR
 * Displays detailed train information in 3D space
 */

import React from 'react'
import { Text, Box, RoundedBox, Sphere } from '@react-three/drei'
import { useRailwayStore } from '@/stores/RailwayStore'

const TrainDetailPanel3D: React.FC = () => {
  const { trainDetails, isTrainDetailOpen } = useRailwayStore()

  if (!isTrainDetailOpen || !trainDetails) {
    return (
      <group>
        <Text
          fontSize={0.025}
          color="#888888"
          anchorX="center"
          anchorY="middle"
        >
          Select a train to view details
        </Text>
      </group>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return '#4caf50'
      case 'stopped':
        return '#ffc107'
      case 'maintenance':
        return '#f44336'
      default:
        return '#888888'
    }
  }

  const getTypeColor = (type: string) => {
    return type === 'express' ? '#8B2635' : '#003f7f'
  }

  const occupancyPercent = (trainDetails.occupancy / trainDetails.capacity) * 100

  return (
    <group>
      {/* Train Name & Type */}
      <group position={[0, 0.2, 0]}>
        <Text
          fontSize={0.04}
          color={getTypeColor(trainDetails.type)}
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {trainDetails.name}
        </Text>
        <RoundedBox
          args={[0.1, 0.025, 0.003]}
          radius={0.005}
          position={[0, -0.03, 0]}
        >
          <meshBasicMaterial color={getTypeColor(trainDetails.type)} />
        </RoundedBox>
        <Text
          fontSize={0.012}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          position={[0, -0.03, 0.005]}
        >
          {trainDetails.type.toUpperCase()}
        </Text>
      </group>

      {/* Status Indicator */}
      <group position={[0, 0.12, 0]}>
        <Sphere args={[0.015, 16, 16]} position={[-0.08, 0, 0]}>
          <meshBasicMaterial color={getStatusColor(trainDetails.status)} />
        </Sphere>
        <Text
          fontSize={0.022}
          color={getStatusColor(trainDetails.status)}
          anchorX="left"
          anchorY="middle"
          position={[-0.05, 0, 0]}
        >
          {trainDetails.status.toUpperCase()}
        </Text>
      </group>

      {/* Speed */}
      <group position={[-0.2, 0.06, 0]}>
        <Text
          fontSize={0.015}
          color="#888888"
          anchorX="left"
          anchorY="middle"
        >
          Speed
        </Text>
        <Text
          fontSize={0.035}
          color="#4fc3f7"
          anchorX="left"
          anchorY="middle"
          position={[0, -0.03, 0]}
          fontWeight="bold"
        >
          {trainDetails.speed} km/h
        </Text>
      </group>

      {/* Next Station */}
      <group position={[0.1, 0.06, 0]}>
        <Text
          fontSize={0.015}
          color="#888888"
          anchorX="left"
          anchorY="middle"
        >
          Next Station
        </Text>
        <Text
          fontSize={0.018}
          color="#ffffff"
          anchorX="left"
          anchorY="middle"
          position={[0, -0.025, 0]}
        >
          {trainDetails.nextStation}
        </Text>
      </group>

      {/* Delay */}
      {trainDetails.delay > 0 && (
        <group position={[-0.2, -0.02, 0]}>
          <Box args={[0.55, 0.04, 0.003]}>
            <meshBasicMaterial color="#f44336" transparent opacity={0.2} />
          </Box>
          <Text
            fontSize={0.018}
            color="#f44336"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            DELAYED: {trainDetails.delay} min
          </Text>
        </group>
      )}

      {/* Occupancy */}
      <group position={[0, -0.08, 0]}>
        <Text
          fontSize={0.015}
          color="#888888"
          anchorX="center"
          anchorY="middle"
          position={[0, 0.025, 0]}
        >
          Passenger Load
        </Text>

        {/* Occupancy bar */}
        <group position={[0, 0, 0]}>
          <Box args={[0.5, 0.025, 0.003]} position={[0, 0, 0]}>
            <meshBasicMaterial color="#333333" />
          </Box>
          <Box
            args={[0.5 * (occupancyPercent / 100), 0.025, 0.004]}
            position={[-0.25 + (0.5 * (occupancyPercent / 100)) / 2, 0, 0.001]}
          >
            <meshBasicMaterial
              color={
                occupancyPercent > 90
                  ? '#f44336'
                  : occupancyPercent > 70
                  ? '#ff9800'
                  : '#4caf50'
              }
            />
          </Box>
        </group>

        <Text
          fontSize={0.02}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          position={[0, -0.03, 0]}
        >
          {trainDetails.occupancy} / {trainDetails.capacity} ({Math.round(occupancyPercent)}%)
        </Text>
      </group>

      {/* Close button hint */}
      <Text
        fontSize={0.012}
        color="#666666"
        anchorX="center"
        anchorY="middle"
        position={[0, -0.18, 0]}
      >
        Pinch to close
      </Text>
    </group>
  )
}

export default TrainDetailPanel3D
