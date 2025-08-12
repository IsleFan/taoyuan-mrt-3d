import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, Grid, Sky } from '@react-three/drei'
import { useRailwayStore } from '@/stores/RailwayStore'
import RailwayRenderer from '@/components/Railway/RailwayRenderer'
import TrainRenderer from '@/components/Railway/TrainRenderer'

const Scene: React.FC = () => {
  const controlsRef = useRef<any>()
  const { network, simulateTrainMovement } = useRailwayStore()

  // Animation loop for train movement simulation
  useFrame((state, delta) => {
    if (network && network.trains.length > 0) {
      // Update train positions every frame
      simulateTrainMovement()
    }
  })

  // Initialize controls
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0)
      controlsRef.current.update()
    }
  }, [])

  return (
    <>
      {/* Lighting Setup */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 5, 0]} intensity={0.5} />

      {/* Environment */}
      <Sky
        distance={450000}
        sunPosition={[0, 1, 0]}
        inclination={0}
        azimuth={0.25}
      />
      <fog attach="fog" args={['#1a1a2e', 50, 200]} />

      {/* Ground Grid */}
      <Grid
        args={[100, 100]}
        cellSize={2}
        cellThickness={0.5}
        cellColor="#4fc3f7"
        sectionSize={10}
        sectionThickness={1}
        sectionColor="#ff4081"
        fadeDistance={50}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={true}
        position={[0, -0.01, 0]}
      />

      {/* Camera Controls */}
      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={100}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
        dampingFactor={0.05}
        enableDamping={true}
      />

      {/* Railway Network */}
      {network && (
        <>
          <RailwayRenderer network={network} />
          <TrainRenderer trains={network.trains} segments={network.segments} />
        </>
      )}
    </>
  )
}

export default Scene