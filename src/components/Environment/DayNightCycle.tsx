/**
 * Day/Night Cycle Environment System
 * Creates realistic lighting based on time of day
 */

import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sky, Stars, Environment } from '@react-three/drei'
import * as THREE from 'three'

interface DayNightCycleProps {
  timeOfDay: number // 0-24 hours
  autoProgress?: boolean
  progressSpeed?: number
  onTimeChange?: (time: number) => void
}

const DayNightCycle: React.FC<DayNightCycleProps> = ({
  timeOfDay,
  autoProgress = false,
  progressSpeed = 0.01,
  onTimeChange,
}) => {
  const sunRef = useRef<THREE.DirectionalLight>(null)
  const timeRef = useRef(timeOfDay)

  // Calculate sun position based on time
  const sunPosition = useMemo(() => {
    const hour = timeOfDay % 24
    const angle = ((hour - 6) / 12) * Math.PI // Sun rises at 6, sets at 18
    const x = Math.cos(angle) * 100
    const y = Math.sin(angle) * 100
    return [x, Math.max(y, -20), 50] as [number, number, number]
  }, [timeOfDay])

  // Calculate lighting colors based on time
  const lightingConfig = useMemo(() => {
    const hour = timeOfDay % 24

    // Dawn: 5-7, Day: 7-17, Dusk: 17-19, Night: 19-5
    if (hour >= 5 && hour < 7) {
      // Dawn - warm orange/pink
      const t = (hour - 5) / 2
      return {
        sunColor: new THREE.Color().lerpColors(
          new THREE.Color(0xff6b35),
          new THREE.Color(0xffffff),
          t
        ),
        ambientColor: new THREE.Color().lerpColors(
          new THREE.Color(0x2d1b4e),
          new THREE.Color(0x87ceeb),
          t
        ),
        ambientIntensity: 0.2 + t * 0.3,
        sunIntensity: 0.3 + t * 0.7,
        fogColor: new THREE.Color().lerpColors(
          new THREE.Color(0x1a0a2e),
          new THREE.Color(0x87ceeb),
          t
        ),
        isNight: false,
      }
    } else if (hour >= 7 && hour < 17) {
      // Day - bright white/yellow
      return {
        sunColor: new THREE.Color(0xfffdf0),
        ambientColor: new THREE.Color(0x87ceeb),
        ambientIntensity: 0.5,
        sunIntensity: 1.0,
        fogColor: new THREE.Color(0xc8e6f5),
        isNight: false,
      }
    } else if (hour >= 17 && hour < 19) {
      // Dusk - warm orange/red
      const t = (hour - 17) / 2
      return {
        sunColor: new THREE.Color().lerpColors(
          new THREE.Color(0xffffff),
          new THREE.Color(0xff4500),
          t
        ),
        ambientColor: new THREE.Color().lerpColors(
          new THREE.Color(0x87ceeb),
          new THREE.Color(0x1a0a2e),
          t
        ),
        ambientIntensity: 0.5 - t * 0.3,
        sunIntensity: 1.0 - t * 0.7,
        fogColor: new THREE.Color().lerpColors(
          new THREE.Color(0xc8e6f5),
          new THREE.Color(0x1a0a2e),
          t
        ),
        isNight: false,
      }
    } else {
      // Night - deep blue
      return {
        sunColor: new THREE.Color(0x4169e1),
        ambientColor: new THREE.Color(0x0a0a1a),
        ambientIntensity: 0.15,
        sunIntensity: 0.1,
        fogColor: new THREE.Color(0x0a0a1a),
        isNight: true,
      }
    }
  }, [timeOfDay])

  // Auto progress time
  useFrame((_, delta) => {
    if (autoProgress && onTimeChange) {
      timeRef.current = (timeRef.current + delta * progressSpeed) % 24
      onTimeChange(timeRef.current)
    }

    // Animate sun light
    if (sunRef.current) {
      sunRef.current.position.set(...sunPosition)
      sunRef.current.color.copy(lightingConfig.sunColor)
      sunRef.current.intensity = lightingConfig.sunIntensity
    }
  })

  const isNight = lightingConfig.isNight

  return (
    <>
      {/* Sky */}
      {!isNight && (
        <Sky
          distance={450000}
          sunPosition={sunPosition}
          inclination={0.5}
          azimuth={0.25}
          mieCoefficient={0.005}
          mieDirectionalG={0.8}
          rayleigh={0.5}
          turbidity={10}
        />
      )}

      {/* Night sky with stars */}
      {isNight && (
        <>
          <color attach="background" args={['#0a0a1a']} />
          <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
            speed={1}
          />
        </>
      )}

      {/* Main directional light (sun/moon) */}
      <directionalLight
        ref={sunRef}
        position={sunPosition}
        color={lightingConfig.sunColor}
        intensity={lightingConfig.sunIntensity}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={200}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />

      {/* Ambient light */}
      <ambientLight
        color={lightingConfig.ambientColor}
        intensity={lightingConfig.ambientIntensity}
      />

      {/* Hemisphere light for more natural lighting */}
      <hemisphereLight
        color={isNight ? '#1a1a4a' : '#87ceeb'}
        groundColor={isNight ? '#0a0a1a' : '#3d5c3d'}
        intensity={isNight ? 0.2 : 0.4}
      />

      {/* Fog */}
      <fog attach="fog" args={[lightingConfig.fogColor, 30, 150]} />

      {/* Environment map for reflections */}
      <Environment preset={isNight ? 'night' : 'city'} background={false} />
    </>
  )
}

export default DayNightCycle
