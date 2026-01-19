/**
 * XR Scene Component
 * Main VR/AR scene wrapper with hand tracking and spatial UI support
 */

import React, { useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useXR } from '@react-three/xr'
import { Grid, Sky } from '@react-three/drei'
import { useRailwayStore } from '@/stores/RailwayStore'
import { useXRStore } from '@/stores/XRStore'
import RailwayRenderer from '@/components/Railway/RailwayRenderer'
import TrainRenderer from '@/components/Railway/TrainRenderer'
import XRHandController from './XRHandController'
import SpatialUIManager from './SpatialUIManager'

const XRSceneContent: React.FC = () => {
  const { network, simulateTrainMovement } = useRailwayStore()
  const { mode, setSessionActive, setUserPosition } = useXRStore()
  const xrState = useXR()
  const { camera } = useThree()

  // Track XR session state
  useEffect(() => {
    setSessionActive(!!xrState.session)
  }, [xrState.session, setSessionActive])

  // Animation loop
  useFrame(() => {
    if (network && network.trains.length > 0) {
      simulateTrainMovement()
    }

    // Update user position from camera in XR mode
    if (xrState.session) {
      setUserPosition({
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
      })
    }
  })

  // World scale for miniature view
  const worldScale = mode === 'vr' ? 0.1 : 1

  return (
    <group scale={[worldScale, worldScale, worldScale]}>
      {/* Lighting Setup */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[36, 10, 0]} intensity={0.8} color="#4fc3f7" />
      <pointLight position={[0, 10, 0]} intensity={0.3} />
      <pointLight position={[72, 10, 0]} intensity={0.3} />

      {/* Environment - conditional based on mode */}
      {mode !== 'ar' && (
        <>
          <Sky
            distance={450000}
            sunPosition={[0, 1, 0]}
            inclination={0}
            azimuth={0.25}
          />
          <fog attach="fog" args={['#1a1a2e', 50, 200]} />
        </>
      )}

      {/* Ground Grid */}
      <Grid
        args={[150, 150]}
        cellSize={2}
        cellThickness={0.5}
        cellColor="#4fc3f7"
        sectionSize={10}
        sectionThickness={1}
        sectionColor="#ff4081"
        fadeDistance={80}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={true}
        position={[36, -0.01, 0]}
      />

      {/* Railway Network */}
      {network && (
        <>
          <RailwayRenderer network={network} />
          <TrainRenderer trains={network.trains} segments={network.segments} />
        </>
      )}
    </group>
  )
}

interface XRSceneProps {
  children?: React.ReactNode
}

const XRScene: React.FC<XRSceneProps> = ({ children }) => {
  const { setXRSupported, mode, settings } = useXRStore()

  // Check XR support on mount
  useEffect(() => {
    const checkXRSupport = async () => {
      if ('xr' in navigator) {
        const xr = (navigator as Navigator & { xr?: { isSessionSupported: (mode: string) => Promise<boolean> } }).xr
        if (xr) {
          const isVRSupported = await xr.isSessionSupported('immersive-vr').catch(() => false)
          const isARSupported = await xr.isSessionSupported('immersive-ar').catch(() => false)
          setXRSupported(isVRSupported || isARSupported)
        }
      }
    }
    checkXRSupport()
  }, [setXRSupported])

  return (
    <>
      {/* Main Scene Content */}
      <XRSceneContent />

      {/* Hand Controllers (only in XR mode with hand tracking enabled) */}
      {mode !== 'desktop' && settings.handTrackingEnabled && (
        <>
          <XRHandController hand="left" />
          <XRHandController hand="right" />
        </>
      )}

      {/* Spatial UI Panels (only in XR mode) */}
      {mode !== 'desktop' && <SpatialUIManager />}

      {children}
    </>
  )
}

export default XRScene
