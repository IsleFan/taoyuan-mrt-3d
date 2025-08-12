import React, { useMemo, useRef, useState } from 'react'
import { Vector3, CatmullRomCurve3, TubeGeometry, Color } from 'three'
import { useFrame } from '@react-three/fiber'
import { Segment } from '@/types/railway'

interface SegmentRendererProps {
  segment: Segment
  onClick: () => void
  onHover: (isHovered: boolean) => void
}

const getSegmentColor = (status: string): Color => {
  switch (status) {
    case 'normal':
      return new Color('#4fc3f7') // Light blue
    case 'maintenance':
      return new Color('#ff9800') // Orange
    case 'delay':
      return new Color('#ffeb3b') // Yellow
    case 'closed':
      return new Color('#f44336') // Red
    default:
      return new Color('#4fc3f7')
  }
}

const SegmentRenderer: React.FC<SegmentRendererProps> = ({ segment, onClick, onHover }) => {
  const meshRef = useRef<any>()
  const [hovered, setHovered] = useState(false)
  
  // Create curve from segment points
  const { curve, geometry } = useMemo(() => {
    const points = segment.points.map(p => new Vector3(p.x, p.y, p.z))
    const curve = new CatmullRomCurve3(points)
    const geometry = new TubeGeometry(curve, 64, 0.1, 8, false)
    return { curve, geometry }
  }, [segment.points])

  // Animate segment glow effect
  useFrame((state) => {
    if (meshRef.current && (hovered || segment.status !== 'normal')) {
      const material = meshRef.current.material
      const time = state.clock.elapsedTime
      
      if (segment.status === 'delay') {
        // Pulsing yellow for delays
        material.emissive.setScalar(Math.sin(time * 4) * 0.2 + 0.3)
      } else if (segment.status === 'maintenance') {
        // Steady orange glow for maintenance
        material.emissive.setScalar(0.4)
      } else if (hovered) {
        // Gentle glow when hovered
        material.emissive.setScalar(0.2)
      }
    }
  })

  const segmentColor = useMemo(() => getSegmentColor(segment.status), [segment.status])

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      onClick={onClick}
      onPointerEnter={(e) => {
        e.stopPropagation()
        setHovered(true)
        onHover(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerLeave={(e) => {
        e.stopPropagation()
        setHovered(false)
        onHover(false)
        document.body.style.cursor = 'auto'
      }}
    >
      <meshStandardMaterial
        color={segmentColor}
        transparent={true}
        opacity={hovered ? 0.9 : 0.7}
        emissive={segmentColor}
        emissiveIntensity={hovered ? 0.2 : 0.1}
        roughness={0.3}
        metalness={0.1}
      />
    </mesh>
  )
}

export default SegmentRenderer