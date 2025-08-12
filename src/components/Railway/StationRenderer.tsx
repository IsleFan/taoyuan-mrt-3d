import React, { useRef, useState } from 'react'
import { Text, Sphere, Cylinder } from '@react-three/drei'
import { Station } from '@/types/railway'

interface StationRendererProps {
  station: Station
}

const getStationColor = (type: string): string => {
  switch (type) {
    case 'terminal':
      return '#f44336' // Red for terminals
    case 'interchange':
      return '#4caf50' // Green for interchanges
    case 'station':
    default:
      return '#2196f3' // Blue for regular stations
  }
}

const getStationSize = (type: string): number => {
  switch (type) {
    case 'terminal':
      return 0.4
    case 'interchange':
      return 0.35
    case 'station':
    default:
      return 0.25
  }
}

const StationRenderer: React.FC<StationRendererProps> = ({ station }) => {
  const [hovered, setHovered] = useState(false)
  const stationRef = useRef<any>()

  const stationColor = getStationColor(station.type)
  const stationSize = getStationSize(station.type)

  return (
    <group position={[station.position.x, station.position.y, station.position.z]}>
      {/* Station Platform Base */}
      <Cylinder
        args={[stationSize * 1.5, stationSize * 1.5, 0.1]}
        position={[0, -0.05, 0]}
      >
        <meshStandardMaterial
          color="#666666"
          transparent={true}
          opacity={0.8}
        />
      </Cylinder>

      {/* Station Building/Icon */}
      <Sphere
        ref={stationRef}
        args={[stationSize]}
        position={[0, stationSize / 2, 0]}
        onPointerEnter={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerLeave={(e) => {
          e.stopPropagation()
          setHovered(false)
          document.body.style.cursor = 'auto'
        }}
      >
        <meshStandardMaterial
          color={stationColor}
          emissive={stationColor}
          emissiveIntensity={hovered ? 0.3 : 0.1}
          transparent={true}
          opacity={hovered ? 0.9 : 0.8}
          roughness={0.2}
          metalness={0.1}
        />
      </Sphere>

      {/* Station Name Text */}
      <Text
        position={[0, stationSize + 0.5, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {station.name}
      </Text>

      {/* English Name Text (smaller) */}
      <Text
        position={[0, stationSize + 0.2, 0]}
        fontSize={0.2}
        color="#cccccc"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        {station.nameEn}
      </Text>

      {/* Station Type Indicator */}
      {station.type !== 'station' && (
        <Text
          position={[0, stationSize - 0.1, 0]}
          fontSize={0.15}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          {station.type.toUpperCase()}
        </Text>
      )}
    </group>
  )
}

export default StationRenderer