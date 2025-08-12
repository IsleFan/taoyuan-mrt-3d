import { Vector3 } from 'three'

export interface Position3D {
  x: number
  y: number
  z: number
}

export interface Station {
  id: string
  name: string
  nameEn: string
  position: Position3D
  type: 'station' | 'terminal' | 'interchange'
}

export interface Segment {
  id: string
  startStationId: string
  endStationId: string
  direction: 'up' | 'down' | 'bidirectional'
  points: Position3D[]
  color: string
  status: 'normal' | 'maintenance' | 'delay' | 'closed'
}

export interface Train {
  id: string
  name: string
  currentSegmentId: string
  position: number // 0-1, position along the segment
  direction: 'up' | 'down'
  speed: number // km/h
  status: 'running' | 'stopped' | 'maintenance'
  nextStation: string
  delay: number // minutes
  capacity: number
  occupancy: number
  type: 'express' | 'commuter'
}

export interface RailwayNetwork {
  id: string
  name: string
  stations: Station[]
  segments: Segment[]
  trains: Train[]
}

export interface TrainDetail {
  id: string
  name: string
  status: string
  speed: number
  nextStation: string
  delay: number
  capacity: number
  occupancy: number
  type: string
  route: string[]
  estimatedArrival?: Date
}