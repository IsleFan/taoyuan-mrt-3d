/**
 * Enhanced 3D Scene with Day/Night Cycle and Post-Processing
 * Inspired by Mini Tokyo 3D visual design
 */

import React, { useRef, useEffect, Suspense } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useRailwayStore } from '@/stores/RailwayStore'
import { useEnvironmentStore } from '@/stores/EnvironmentStore'
import RailwayRenderer from '@/components/Railway/RailwayRenderer'
import TrainRenderer from '@/components/Railway/TrainRenderer'
import DayNightCycle from '@/components/Environment/DayNightCycle'
import RealisticGround from '@/components/Environment/RealisticGround'
import CityBuildings from '@/components/Environment/CityBuildings'
import PostProcessing from '@/components/Effects/PostProcessing'

const Scene: React.FC = () => {
  const controlsRef = useRef<any>()
  const { network, simulateTrainMovement } = useRailwayStore()
  const {
    timeOfDay,
    autoProgressTime,
    timeSpeed,
    setTimeOfDay,
    enableBloom,
    bloomIntensity,
    enableVignette,
    enableChromaticAberration,
    showGrid,
    showBuildings,
  } = useEnvironmentStore()

  const { gl } = useThree()

  // Determine if it's night mode
  const isNightMode = timeOfDay < 6 || timeOfDay >= 19

  // Animation loop for train movement simulation
  useFrame(() => {
    if (network && network.trains.length > 0) {
      simulateTrainMovement()
    }
  })

  // Initialize controls and renderer settings
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.set(36, 0, 0)
      controlsRef.current.update()
    }

    // Enable shadows on renderer
    gl.shadowMap.enabled = true
    gl.shadowMap.type = 2 // PCFSoftShadowMap
  }, [gl])

  // Extract railway path for building placement
  const railwayPath: [number, number][] = network
    ? network.stations.map((s) => [s.position.x, s.position.z])
    : []

  return (
    <>
      {/* Environment & Lighting */}
      <Suspense fallback={null}>
        <DayNightCycle
          timeOfDay={timeOfDay}
          autoProgress={autoProgressTime}
          progressSpeed={timeSpeed}
          onTimeChange={setTimeOfDay}
        />
      </Suspense>

      {/* Ground and Terrain */}
      <RealisticGround
        size={200}
        showGrid={showGrid}
        nightMode={isNightMode}
      />

      {/* City Buildings */}
      {showBuildings && (
        <CityBuildings
          count={80}
          area={70}
          nightMode={isNightMode}
          railwayPath={railwayPath}
        />
      )}

      {/* Camera Controls */}
      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={150}
        minPolarAngle={0.1}
        maxPolarAngle={Math.PI / 2 - 0.1}
        dampingFactor={0.05}
        enableDamping={true}
        rotateSpeed={0.5}
        zoomSpeed={1.2}
      />

      {/* Railway Network */}
      {network && (
        <>
          <RailwayRenderer network={network} />
          <TrainRenderer trains={network.trains} segments={network.segments} />
        </>
      )}

      {/* Post-Processing Effects */}
      <PostProcessing
        enableBloom={enableBloom}
        bloomIntensity={isNightMode ? bloomIntensity * 1.5 : bloomIntensity}
        enableVignette={enableVignette}
        enableChromaticAberration={enableChromaticAberration}
        nightMode={isNightMode}
      />
    </>
  )
}

export default Scene
