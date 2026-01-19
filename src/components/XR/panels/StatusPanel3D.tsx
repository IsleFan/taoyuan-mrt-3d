/**
 * 3D Status Panel for VR/AR
 * Displays real-time network monitoring data in 3D space
 */

import React from 'react'
import { Text, Box, Sphere } from '@react-three/drei'
import { useRailwayStore } from '@/stores/RailwayStore'

const StatusPanel3D: React.FC = () => {
  const { network } = useRailwayStore()

  if (!network) return null

  // Calculate statistics
  const totalTrains = network.trains.length
  const runningTrains = network.trains.filter((t) => t.status === 'running').length
  const totalSegments = network.segments.length
  const normalSegments = network.segments.filter((s) => s.status === 'normal').length
  const delayedTrains = network.trains.filter((t) => t.delay > 0).length
  const maintenanceSegments = network.segments.filter(
    (s) => s.status === 'maintenance'
  ).length

  const trainHealthPercent = (runningTrains / totalTrains) * 100
  const segmentHealthPercent = (normalSegments / totalSegments) * 100

  const getHealthColor = (percent: number) => {
    if (percent >= 90) return '#4caf50'
    if (percent >= 70) return '#ffc107'
    return '#f44336'
  }

  return (
    <group>
      {/* Title */}
      <Text
        fontSize={0.035}
        color="#4fc3f7"
        anchorX="center"
        anchorY="top"
        position={[0, 0.22, 0]}
        fontWeight="bold"
      >
        Network Status
      </Text>

      {/* Train Status Section */}
      <group position={[-0.2, 0.1, 0]}>
        <Text
          fontSize={0.02}
          color="#ffffff"
          anchorX="left"
          anchorY="middle"
          position={[-0.15, 0, 0]}
        >
          Trains Operating
        </Text>
        <Text
          fontSize={0.04}
          color={getHealthColor(trainHealthPercent)}
          anchorX="center"
          anchorY="middle"
          position={[0.2, 0, 0]}
          fontWeight="bold"
        >
          {runningTrains}/{totalTrains}
        </Text>

        {/* Progress bar */}
        <group position={[0, -0.03, 0]}>
          <Box args={[0.35, 0.015, 0.005]} position={[0, 0, 0]}>
            <meshBasicMaterial color="#333333" />
          </Box>
          <Box
            args={[0.35 * (trainHealthPercent / 100), 0.015, 0.006]}
            position={[-0.175 + (0.35 * (trainHealthPercent / 100)) / 2, 0, 0.001]}
          >
            <meshBasicMaterial color={getHealthColor(trainHealthPercent)} />
          </Box>
        </group>
      </group>

      {/* Segment Status Section */}
      <group position={[-0.2, -0.02, 0]}>
        <Text
          fontSize={0.02}
          color="#ffffff"
          anchorX="left"
          anchorY="middle"
          position={[-0.15, 0, 0]}
        >
          Segments Normal
        </Text>
        <Text
          fontSize={0.04}
          color={getHealthColor(segmentHealthPercent)}
          anchorX="center"
          anchorY="middle"
          position={[0.2, 0, 0]}
          fontWeight="bold"
        >
          {normalSegments}/{totalSegments}
        </Text>

        {/* Progress bar */}
        <group position={[0, -0.03, 0]}>
          <Box args={[0.35, 0.015, 0.005]} position={[0, 0, 0]}>
            <meshBasicMaterial color="#333333" />
          </Box>
          <Box
            args={[0.35 * (segmentHealthPercent / 100), 0.015, 0.006]}
            position={[-0.175 + (0.35 * (segmentHealthPercent / 100)) / 2, 0, 0.001]}
          >
            <meshBasicMaterial color={getHealthColor(segmentHealthPercent)} />
          </Box>
        </group>
      </group>

      {/* Alerts Section */}
      <group position={[0, -0.15, 0]}>
        <Text
          fontSize={0.018}
          color="#888888"
          anchorX="center"
          anchorY="middle"
          position={[0, 0.02, 0]}
        >
          ALERTS
        </Text>

        {/* Alert indicators */}
        <group position={[-0.15, -0.02, 0]}>
          <Sphere args={[0.01, 8, 8]}>
            <meshBasicMaterial color={delayedTrains > 0 ? '#f44336' : '#4caf50'} />
          </Sphere>
          <Text
            fontSize={0.015}
            color="#ffffff"
            anchorX="left"
            anchorY="middle"
            position={[0.02, 0, 0]}
          >
            {delayedTrains} Delayed
          </Text>
        </group>

        <group position={[0.1, -0.02, 0]}>
          <Sphere args={[0.01, 8, 8]}>
            <meshBasicMaterial color={maintenanceSegments > 0 ? '#ffc107' : '#4caf50'} />
          </Sphere>
          <Text
            fontSize={0.015}
            color="#ffffff"
            anchorX="left"
            anchorY="middle"
            position={[0.02, 0, 0]}
          >
            {maintenanceSegments} Maintenance
          </Text>
        </group>
      </group>
    </group>
  )
}

export default StatusPanel3D
