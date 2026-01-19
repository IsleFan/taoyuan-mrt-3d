/**
 * XR State Management Store
 * Manages VR/AR mode, hand tracking, and spatial UI state
 */

import { create } from 'zustand'

export type XRMode = 'desktop' | 'vr' | 'ar'
export type HandGesture = 'idle' | 'pinch' | 'grab' | 'point' | 'palm'

export interface Hand3DPosition {
  x: number
  y: number
  z: number
}

export interface HandState {
  position: Hand3DPosition
  rotation: { x: number; y: number; z: number }
  gesture: HandGesture
  pinchStrength: number
  isTracking: boolean
}

export interface SpatialPanel {
  id: string
  type: 'status' | 'train-detail' | 'settings' | 'alerts'
  position: Hand3DPosition
  rotation: { x: number; y: number; z: number }
  scale: number
  isVisible: boolean
  isLocked: boolean
}

interface XRState {
  // XR Mode
  mode: XRMode
  isXRSupported: boolean
  isSessionActive: boolean

  // Hand Tracking
  leftHand: HandState | null
  rightHand: HandState | null
  dominantHand: 'left' | 'right'

  // Spatial UI
  panels: SpatialPanel[]
  selectedPanelId: string | null

  // User Position & Scale
  userPosition: Hand3DPosition
  worldScale: number

  // Settings
  settings: {
    handTrackingEnabled: boolean
    hapticFeedback: boolean
    voiceCommands: boolean
    passthrough: boolean
    uiScale: number
    soundEnabled: boolean
  }

  // Actions
  setMode: (mode: XRMode) => void
  setXRSupported: (supported: boolean) => void
  setSessionActive: (active: boolean) => void
  updateLeftHand: (hand: HandState | null) => void
  updateRightHand: (hand: HandState | null) => void
  setDominantHand: (hand: 'left' | 'right') => void

  // Panel Management
  addPanel: (panel: SpatialPanel) => void
  removePanel: (panelId: string) => void
  updatePanel: (panelId: string, updates: Partial<SpatialPanel>) => void
  selectPanel: (panelId: string | null) => void
  togglePanelVisibility: (panelId: string) => void
  lockPanel: (panelId: string, locked: boolean) => void

  // User Controls
  setUserPosition: (position: Hand3DPosition) => void
  setWorldScale: (scale: number) => void
  updateSettings: (settings: Partial<XRState['settings']>) => void

  // Utilities
  resetPanels: () => void
  getActivePanels: () => SpatialPanel[]
}

const defaultPanels: SpatialPanel[] = [
  {
    id: 'main-status',
    type: 'status',
    position: { x: 2, y: 1.5, z: -2 },
    rotation: { x: 0, y: -0.3, z: 0 },
    scale: 1,
    isVisible: true,
    isLocked: false,
  },
  {
    id: 'alerts',
    type: 'alerts',
    position: { x: -2, y: 1.5, z: -2 },
    rotation: { x: 0, y: 0.3, z: 0 },
    scale: 1,
    isVisible: true,
    isLocked: false,
  },
]

export const useXRStore = create<XRState>((set, get) => ({
  // Initial State
  mode: 'desktop',
  isXRSupported: false,
  isSessionActive: false,

  leftHand: null,
  rightHand: null,
  dominantHand: 'right',

  panels: defaultPanels,
  selectedPanelId: null,

  userPosition: { x: 0, y: 1.6, z: 0 },
  worldScale: 1,

  settings: {
    handTrackingEnabled: true,
    hapticFeedback: true,
    voiceCommands: false,
    passthrough: true,
    uiScale: 1,
    soundEnabled: true,
  },

  // Actions
  setMode: (mode) => set({ mode }),
  setXRSupported: (supported) => set({ isXRSupported: supported }),
  setSessionActive: (active) => set({ isSessionActive: active }),

  updateLeftHand: (hand) => set({ leftHand: hand }),
  updateRightHand: (hand) => set({ rightHand: hand }),
  setDominantHand: (hand) => set({ dominantHand: hand }),

  addPanel: (panel) => set((state) => ({
    panels: [...state.panels, panel],
  })),

  removePanel: (panelId) => set((state) => ({
    panels: state.panels.filter((p) => p.id !== panelId),
    selectedPanelId: state.selectedPanelId === panelId ? null : state.selectedPanelId,
  })),

  updatePanel: (panelId, updates) => set((state) => ({
    panels: state.panels.map((p) =>
      p.id === panelId ? { ...p, ...updates } : p
    ),
  })),

  selectPanel: (panelId) => set({ selectedPanelId: panelId }),

  togglePanelVisibility: (panelId) => set((state) => ({
    panels: state.panels.map((p) =>
      p.id === panelId ? { ...p, isVisible: !p.isVisible } : p
    ),
  })),

  lockPanel: (panelId, locked) => set((state) => ({
    panels: state.panels.map((p) =>
      p.id === panelId ? { ...p, isLocked: locked } : p
    ),
  })),

  setUserPosition: (position) => set({ userPosition: position }),
  setWorldScale: (scale) => set({ worldScale: Math.max(0.1, Math.min(10, scale)) }),

  updateSettings: (settings) => set((state) => ({
    settings: { ...state.settings, ...settings },
  })),

  resetPanels: () => set({ panels: defaultPanels, selectedPanelId: null }),

  getActivePanels: () => get().panels.filter((p) => p.isVisible),
}))
