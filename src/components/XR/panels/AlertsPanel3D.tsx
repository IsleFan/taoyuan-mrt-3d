/**
 * 3D Alerts Panel for VR/AR
 * Displays real-time alerts and warnings in 3D space
 */

import React, { useMemo } from 'react'
import { Text, Box, Sphere } from '@react-three/drei'
import { useRailwayStore } from '@/stores/RailwayStore'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

interface Alert {
  id: string
  type: 'delay' | 'maintenance' | 'closed' | 'warning'
  message: string
  severity: 'low' | 'medium' | 'high'
  timestamp: Date
}

const AlertsPanel3D: React.FC = () => {
  const { network } = useRailwayStore()
  const pulseRef = useRef<THREE.Mesh>(null)

  // Pulse animation for high severity alerts
  useFrame(({ clock }) => {
    if (pulseRef.current) {
      const scale = 1 + Math.sin(clock.elapsedTime * 3) * 0.1
      pulseRef.current.scale.setScalar(scale)
    }
  })

  // Generate alerts from current network state
  const alerts = useMemo<Alert[]>(() => {
    if (!network) return []

    const alertList: Alert[] = []

    // Train delays
    network.trains.forEach((train) => {
      if (train.delay > 0) {
        alertList.push({
          id: `delay-${train.id}`,
          type: 'delay',
          message: `${train.name}: ${train.delay} min delay`,
          severity: train.delay > 10 ? 'high' : train.delay > 5 ? 'medium' : 'low',
          timestamp: new Date(),
        })
      }

      if (train.status === 'maintenance') {
        alertList.push({
          id: `maint-train-${train.id}`,
          type: 'maintenance',
          message: `${train.name}: Under maintenance`,
          severity: 'medium',
          timestamp: new Date(),
        })
      }
    })

    // Segment issues
    network.segments.forEach((segment) => {
      if (segment.status === 'maintenance') {
        alertList.push({
          id: `maint-seg-${segment.id}`,
          type: 'maintenance',
          message: `Segment ${segment.id}: Maintenance`,
          severity: 'medium',
          timestamp: new Date(),
        })
      }
      if (segment.status === 'closed') {
        alertList.push({
          id: `closed-${segment.id}`,
          type: 'closed',
          message: `Segment ${segment.id}: CLOSED`,
          severity: 'high',
          timestamp: new Date(),
        })
      }
      if (segment.status === 'delay') {
        alertList.push({
          id: `delay-seg-${segment.id}`,
          type: 'delay',
          message: `Segment ${segment.id}: Delays`,
          severity: 'low',
          timestamp: new Date(),
        })
      }
    })

    return alertList.slice(0, 5) // Show max 5 alerts
  }, [network])

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return '#f44336'
      case 'medium':
        return '#ff9800'
      case 'low':
        return '#ffc107'
      default:
        return '#ffffff'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'delay':
        return '!'
      case 'maintenance':
        return 'M'
      case 'closed':
        return 'X'
      default:
        return '?'
    }
  }

  const hasHighSeverity = alerts.some((a) => a.severity === 'high')

  return (
    <group>
      {/* Title */}
      <group position={[0, 0.22, 0]}>
        {hasHighSeverity && (
          <Sphere args={[0.015, 8, 8]} position={[-0.12, 0, 0]} ref={pulseRef}>
            <meshBasicMaterial color="#f44336" />
          </Sphere>
        )}
        <Text
          fontSize={0.035}
          color={hasHighSeverity ? '#f44336' : '#4fc3f7'}
          anchorX="center"
          anchorY="top"
          fontWeight="bold"
        >
          {hasHighSeverity ? 'ALERTS!' : 'Alerts'}
        </Text>
      </group>

      {/* Alert count */}
      <Text
        fontSize={0.02}
        color="#888888"
        anchorX="center"
        anchorY="top"
        position={[0, 0.17, 0]}
      >
        {alerts.length} Active Alert{alerts.length !== 1 ? 's' : ''}
      </Text>

      {/* Alert list */}
      <group position={[0, 0.1, 0]}>
        {alerts.length === 0 ? (
          <group position={[0, -0.05, 0]}>
            <Sphere args={[0.02, 16, 16]}>
              <meshBasicMaterial color="#4caf50" />
            </Sphere>
            <Text
              fontSize={0.025}
              color="#4caf50"
              anchorX="center"
              anchorY="middle"
              position={[0, -0.05, 0]}
            >
              All Clear
            </Text>
          </group>
        ) : (
          alerts.map((alert, index) => (
            <group key={alert.id} position={[0, -index * 0.055, 0]}>
              {/* Alert indicator */}
              <Box
                args={[0.65, 0.045, 0.005]}
                position={[0, 0, 0]}
              >
                <meshBasicMaterial
                  color={getAlertColor(alert.severity)}
                  transparent
                  opacity={0.2}
                />
              </Box>

              {/* Severity icon */}
              <group position={[-0.28, 0, 0.003]}>
                <Sphere args={[0.012, 8, 8]}>
                  <meshBasicMaterial color={getAlertColor(alert.severity)} />
                </Sphere>
                <Text
                  fontSize={0.012}
                  color="#ffffff"
                  anchorX="center"
                  anchorY="middle"
                  position={[0, 0, 0.01]}
                  fontWeight="bold"
                >
                  {getTypeIcon(alert.type)}
                </Text>
              </group>

              {/* Alert message */}
              <Text
                fontSize={0.016}
                color="#ffffff"
                anchorX="left"
                anchorY="middle"
                position={[-0.24, 0, 0.003]}
                maxWidth={0.5}
              >
                {alert.message}
              </Text>
            </group>
          ))
        )}
      </group>
    </group>
  )
}

export default AlertsPanel3D
