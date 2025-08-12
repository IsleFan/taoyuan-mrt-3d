import React from 'react'
import { Train, Segment } from '@/types/railway'
import TrainModel from './TrainModel'

interface TrainRendererProps {
  trains: Train[]
  segments: Segment[]
}

const TrainRenderer: React.FC<TrainRendererProps> = ({ trains, segments }) => {
  return (
    <group name="trains">
      {trains.map(train => {
        const segment = segments.find(s => s.id === train.currentSegmentId)
        if (!segment) return null

        return (
          <TrainModel
            key={train.id}
            train={train}
            segment={segment}
          />
        )
      })}
    </group>
  )
}

export default TrainRenderer