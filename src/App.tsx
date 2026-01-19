/**
 * Taoyuan Airport MRT 3D Network Monitoring System
 * Main Application Entry Point with XR Support
 */

import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { XR, createXRStore } from '@react-three/xr'
import Scene from '@/components/Scene/Scene'
import UIOverlay from '@/components/UI/UIOverlay'
import NetworkInitializer from '@/components/NetworkInitializer'
import XRButton from '@/components/XR/XRButton'
import SpatialUIManager from '@/components/XR/SpatialUIManager'
import XRHandController from '@/components/XR/XRHandController'
import { RailwayProvider } from '@/stores/RailwayStore'
import { useXRStore } from '@/stores/XRStore'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { CircularProgress, Typography } from '@mui/material'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4fc3f7',
    },
    secondary: {
      main: '#ff4081',
    },
    background: {
      default: '#1a1a2e',
      paper: '#16213e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Noto Sans TC", sans-serif',
  },
})

// Create XR store for WebXR session management
const xrStore = createXRStore()

// Loading fallback component
const LoadingFallback: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16,
    }}
  >
    <CircularProgress size={60} sx={{ color: '#4fc3f7' }} />
    <Typography variant="body1" sx={{ color: '#ffffff' }}>
      Loading 3D Scene...
    </Typography>
  </div>
)

// XR Scene wrapper component
const XRSceneContent: React.FC = () => {
  const { mode, settings } = useXRStore()

  return (
    <>
      {/* Main Scene */}
      <Scene />

      {/* Spatial UI for VR/AR mode */}
      {mode !== 'desktop' && <SpatialUIManager />}

      {/* Hand Controllers for VR/AR */}
      {mode !== 'desktop' && settings.handTrackingEnabled && (
        <>
          <XRHandController hand="left" />
          <XRHandController hand="right" />
        </>
      )}
    </>
  )
}

// Main App component
function App() {
  const { mode } = useXRStore()

  // Camera position based on mode
  const getCameraPosition = (): [number, number, number] => {
    switch (mode) {
      case 'vr':
        return [36, 5, 20] // Lower for VR comfort
      case 'ar':
        return [36, 2, 5] // Closer for AR
      default:
        return [36, 25, 30] // Default desktop view
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RailwayProvider>
        <NetworkInitializer />
        <div
          style={{
            width: '100vw',
            height: '100vh',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* 3D Canvas with XR support */}
          <Canvas
            camera={{
              position: getCameraPosition(),
              fov: mode === 'vr' ? 90 : 50,
              near: 0.1,
              far: 1000,
            }}
            style={{
              background:
                mode === 'ar'
                  ? 'transparent'
                  : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            }}
            gl={{
              antialias: true,
              alpha: mode === 'ar', // Transparent background for AR
              powerPreference: 'high-performance',
            }}
          >
            <Suspense fallback={null}>
              <XR store={xrStore}>
                <XRSceneContent />
              </XR>
            </Suspense>
          </Canvas>

          {/* Loading indicator */}
          <Suspense fallback={<LoadingFallback />}>
            {/* 2D UI Overlay (hidden in VR/AR) */}
            {mode === 'desktop' && <UIOverlay />}
          </Suspense>

          {/* XR Mode Selector Button */}
          <XRButton />

          {/* VR/AR Entry Button */}
          {mode !== 'desktop' && (
            <div
              style={{
                position: 'fixed',
                top: 20,
                right: 20,
                zIndex: 1000,
              }}
            >
              <button
                onClick={() => xrStore.enterVR()}
                style={{
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  backgroundColor: mode === 'vr' ? '#ff4081' : '#9c27b0',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease',
                }}
              >
                {mode === 'vr' ? 'Enter VR' : 'Enter AR'}
              </button>
            </div>
          )}

          {/* Instructions for XR mode */}
          {mode !== 'desktop' && (
            <div
              style={{
                position: 'fixed',
                bottom: 80,
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(0,0,0,0.7)',
                padding: '12px 20px',
                borderRadius: '8px',
                zIndex: 999,
              }}
            >
              <Typography variant="body2" sx={{ color: '#ffffff', textAlign: 'center' }}>
                {mode === 'vr'
                  ? 'Use hand gestures: Pinch to select, Grab to move panels'
                  : 'Point at trains to view details, move panels with gestures'}
              </Typography>
            </div>
          )}
        </div>
      </RailwayProvider>
    </ThemeProvider>
  )
}

export default App
