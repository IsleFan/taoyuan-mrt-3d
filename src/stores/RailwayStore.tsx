import React, { createContext, useContext, ReactNode } from 'react'
import { create } from 'zustand'
import { RailwayNetwork, Train, Segment, TrainDetail } from '@/types/railway'

interface RailwayState {
  network: RailwayNetwork | null
  selectedTrain: Train | null
  hoveredTrain: Train | null
  trainDetails: TrainDetail | null
  isTrainDetailOpen: boolean
  
  // Actions
  setNetwork: (network: RailwayNetwork) => void
  updateTrain: (trainId: string, updates: Partial<Train>) => void
  updateSegment: (segmentId: string, updates: Partial<Segment>) => void
  selectTrain: (train: Train | null) => void
  setHoveredTrain: (train: Train | null) => void
  openTrainDetail: (trainId: string) => void
  closeTrainDetail: () => void
  simulateTrainMovement: () => void
}

export const useRailwayStore = create<RailwayState>((set, get) => ({
  network: null,
  selectedTrain: null,
  hoveredTrain: null,
  trainDetails: null,
  isTrainDetailOpen: false,

  setNetwork: (network) => set({ network }),

  updateTrain: (trainId, updates) => set((state) => {
    if (!state.network) return state
    return {
      network: {
        ...state.network,
        trains: state.network.trains.map(train =>
          train.id === trainId ? { ...train, ...updates } : train
        )
      }
    }
  }),

  updateSegment: (segmentId, updates) => set((state) => {
    if (!state.network) return state
    return {
      network: {
        ...state.network,
        segments: state.network.segments.map(segment =>
          segment.id === segmentId ? { ...segment, ...updates } : segment
        )
      }
    }
  }),

  selectTrain: (train) => set({ selectedTrain: train }),

  setHoveredTrain: (train) => set({ hoveredTrain: train }),

  openTrainDetail: (trainId) => {
    const state = get()
    if (!state.network) return
    
    const train = state.network.trains.find(t => t.id === trainId)
    if (!train) return

    const trainDetail: TrainDetail = {
      id: train.id,
      name: train.name,
      status: train.status,
      speed: train.speed,
      nextStation: train.nextStation,
      delay: train.delay,
      capacity: train.capacity,
      occupancy: train.occupancy,
      type: train.type,
      route: [], // Will be populated based on current route
    }

    set({ trainDetails: trainDetail, isTrainDetailOpen: true })
  },

  closeTrainDetail: () => set({ isTrainDetailOpen: false, trainDetails: null }),

  simulateTrainMovement: () => {
    const state = get()
    if (!state.network) return

    state.network.trains.forEach(train => {
      const newPosition = (train.position + 0.001) % 1
      get().updateTrain(train.id, { position: newPosition })
    })
  }
}))

export const RailwayProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>
}