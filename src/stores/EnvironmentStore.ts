/**
 * Environment Store
 * Manages visual effects and environment settings
 */

import { create } from 'zustand'

interface EnvironmentState {
  // Time of day (0-24)
  timeOfDay: number
  autoProgressTime: boolean
  timeSpeed: number

  // Visual effects
  enableBloom: boolean
  bloomIntensity: number
  enableVignette: boolean
  enableChromaticAberration: boolean

  // Environment
  showGrid: boolean
  showBuildings: boolean
  fogDensity: number

  // Actions
  setTimeOfDay: (time: number) => void
  toggleAutoProgress: () => void
  setTimeSpeed: (speed: number) => void
  setBloomIntensity: (intensity: number) => void
  toggleBloom: () => void
  toggleVignette: () => void
  toggleChromaticAberration: () => void
  toggleGrid: () => void
  toggleBuildings: () => void
  setFogDensity: (density: number) => void

  // Presets
  setDayPreset: () => void
  setNightPreset: () => void
  setSunsetPreset: () => void
}

export const useEnvironmentStore = create<EnvironmentState>((set) => ({
  // Initial state - Start with night mode for dramatic effect
  timeOfDay: 21, // 9 PM - Night mode
  autoProgressTime: false,
  timeSpeed: 0.5,

  enableBloom: true,
  bloomIntensity: 1.0, // Higher for more visible effect
  enableVignette: true,
  enableChromaticAberration: false,

  showGrid: true,
  showBuildings: true,
  fogDensity: 0.02,

  // Actions
  setTimeOfDay: (time) => set({ timeOfDay: time % 24 }),
  toggleAutoProgress: () => set((state) => ({ autoProgressTime: !state.autoProgressTime })),
  setTimeSpeed: (speed) => set({ timeSpeed: speed }),
  setBloomIntensity: (intensity) => set({ bloomIntensity: intensity }),
  toggleBloom: () => set((state) => ({ enableBloom: !state.enableBloom })),
  toggleVignette: () => set((state) => ({ enableVignette: !state.enableVignette })),
  toggleChromaticAberration: () =>
    set((state) => ({ enableChromaticAberration: !state.enableChromaticAberration })),
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  toggleBuildings: () => set((state) => ({ showBuildings: !state.showBuildings })),
  setFogDensity: (density) => set({ fogDensity: density }),

  // Presets
  setDayPreset: () =>
    set({
      timeOfDay: 12,
      enableBloom: true,
      bloomIntensity: 0.3,
      enableVignette: true,
      enableChromaticAberration: false,
    }),
  setNightPreset: () =>
    set({
      timeOfDay: 22,
      enableBloom: true,
      bloomIntensity: 0.8,
      enableVignette: true,
      enableChromaticAberration: false,
    }),
  setSunsetPreset: () =>
    set({
      timeOfDay: 18,
      enableBloom: true,
      bloomIntensity: 0.6,
      enableVignette: true,
      enableChromaticAberration: true,
    }),
}))
