import React, { useMemo } from 'react'
import { Vector3, CatmullRomCurve3, TubeGeometry } from 'three'
import { useRailwayStore } from '@/stores/RailwayStore'
import { RailwayNetwork, Segment } from '@/types/railway'
import StationRenderer from './StationRenderer'
import SegmentRenderer from './SegmentRenderer'

interface RailwayRendererProps {
  network: RailwayNetwork
}

const RailwayRenderer: React.FC<RailwayRendererProps> = ({ network }) => {
  const { updateSegment } = useRailwayStore()

  // Memoize stations and segments for performance
  const stations = useMemo(() => network.stations, [network.stations])
  const segments = useMemo(() => network.segments, [network.segments])

  const handleSegmentClick = (segmentId: string) => {
    const segment = segments.find(s => s.id === segmentId)
    if (segment) {
      // Toggle segment status for demonstration
      const newStatus = segment.status === 'normal' ? 'maintenance' : 'normal'
      updateSegment(segmentId, { status: newStatus })
    }
  }

  const handleSegmentHover = (segmentId: string, isHovered: boolean) => {
    // Could implement hover effects here
    console.log(`Segment ${segmentId} hovered: ${isHovered}`)
  }

  return (
    <group name="railway-network">
      {/* Render Stations */}
      <group name="stations">
        {stations.map(station => (
          <StationRenderer
            key={station.id}
            station={station}
          />
        ))}
      </group>

      {/* Render Railway Segments */}
      <group name="segments">
        {segments.map(segment => (
          <SegmentRenderer
            key={segment.id}
            segment={segment}
            onClick={() => handleSegmentClick(segment.id)}
            onHover={(isHovered) => handleSegmentHover(segment.id, isHovered)}
          />
        ))}
      </group>
    </group>
  )
}

export default RailwayRenderer