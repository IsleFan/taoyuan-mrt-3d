/**
 * XR Hand Controller Component
 * Provides hand tracking and gesture recognition for Vision Pro and other XR devices
 */

import React, { useRef, useState, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { useXR, useXRInputSourceState } from '@react-three/xr'
import { useXRStore, HandGesture, HandState } from '@/stores/XRStore'
import { useRailwayStore } from '@/stores/RailwayStore'
import { Text, Sphere } from '@react-three/drei'
import * as THREE from 'three'

interface XRHandControllerProps {
  hand: 'left' | 'right'
}

// Gesture detection thresholds
const PINCH_THRESHOLD = 0.7
const GRAB_THRESHOLD = 0.8

const XRHandController: React.FC<XRHandControllerProps> = ({ hand }) => {
  const xrState = useXR()
  const inputState = useXRInputSourceState(hand === 'left' ? 'hand' : 'hand')
  const groupRef = useRef<THREE.Group>(null)

  const {
    updateLeftHand,
    updateRightHand,
    panels,
    selectedPanelId,
    updatePanel,
  } = useXRStore()

  const { openTrainDetail } = useRailwayStore()

  const [currentGesture, setCurrentGesture] = useState<HandGesture>('idle')
  const [isPointing, setIsPointing] = useState(false)
  const [controllerPosition, setControllerPosition] = useState<THREE.Vector3>(new THREE.Vector3())

  // Raycaster for interaction
  const raycaster = useRef(new THREE.Raycaster())

  // Update hand state in store
  const updateHandState = useCallback((handState: HandState | null) => {
    if (hand === 'left') {
      updateLeftHand(handState)
    } else {
      updateRightHand(handState)
    }
  }, [hand, updateLeftHand, updateRightHand])

  // Detect gesture from input state
  const detectGesture = useCallback((state: typeof inputState): HandGesture => {
    if (!state || !state.inputSource.gamepad) return 'idle'

    const gamepad = state.inputSource.gamepad
    const buttons = gamepad.buttons

    // Check for pinch (select button pressed)
    if (buttons[0]?.pressed || buttons[0]?.value > PINCH_THRESHOLD) {
      return 'pinch'
    }

    // Check for grab (squeeze button pressed)
    if (buttons[1]?.pressed || buttons[1]?.value > GRAB_THRESHOLD) {
      return 'grab'
    }

    // Check for pointing (trigger partially pressed)
    if (buttons[0]?.value > 0.1 && buttons[0]?.value < PINCH_THRESHOLD) {
      return 'point'
    }

    return 'idle'
  }, [])

  // Handle pinch gesture (select)
  const handlePinch = useCallback(() => {
    if (!groupRef.current) return

    // Cast ray from controller position
    raycaster.current.ray.origin.copy(controllerPosition)
    raycaster.current.ray.direction.set(0, 0, -1)

    // Find intersections with trains
    const trainMeshes: THREE.Object3D[] = []
    groupRef.current.parent?.traverse((child) => {
      if (child.userData.trainId) {
        trainMeshes.push(child)
      }
    })

    const intersects = raycaster.current.intersectObjects(trainMeshes, true)
    if (intersects.length > 0) {
      const trainId = intersects[0].object.userData.trainId
      if (trainId) {
        openTrainDetail(trainId)
      }
    }
  }, [controllerPosition, openTrainDetail])

  // Handle grab gesture (move panel)
  const handleGrab = useCallback(() => {
    if (!selectedPanelId) return

    const panel = panels.find((p) => p.id === selectedPanelId)
    if (panel && !panel.isLocked) {
      updatePanel(selectedPanelId, {
        position: {
          x: controllerPosition.x,
          y: controllerPosition.y,
          z: controllerPosition.z,
        },
      })
    }
  }, [selectedPanelId, panels, updatePanel, controllerPosition])

  // Update every frame
  useFrame(() => {
    if (!inputState) {
      updateHandState(null)
      return
    }

    // Get controller position from input source
    const grip = inputState.inputSource.gripSpace
    if (grip && xrState.originReferenceSpace) {
      // Use a default position if we can't get the actual pose
      const position = new THREE.Vector3(
        hand === 'left' ? -0.3 : 0.3,
        1.4,
        -0.5
      )
      setControllerPosition(position)
    }

    // Detect current gesture
    const gesture = detectGesture(inputState)
    const prevGesture = currentGesture
    setCurrentGesture(gesture)

    // Get pinch strength from trigger button
    const pinchStrength = inputState.inputSource.gamepad?.buttons[0]?.value || 0

    // Update hand state in store
    updateHandState({
      position: { x: controllerPosition.x, y: controllerPosition.y, z: controllerPosition.z },
      rotation: { x: 0, y: 0, z: 0 },
      gesture,
      pinchStrength,
      isTracking: true,
    })

    // Handle gestures on state change
    if (gesture === 'pinch' && prevGesture !== 'pinch') {
      handlePinch()
    } else if (gesture === 'grab') {
      handleGrab()
    }

    setIsPointing(gesture === 'point' || gesture === 'pinch')
  })

  // Don't render if no session
  if (!xrState.session) return null

  return (
    <group ref={groupRef}>
      {/* Controller pointer ray */}
      {isPointing && (
        <group position={controllerPosition.toArray()}>
          <mesh>
            <cylinderGeometry args={[0.002, 0.002, 5, 8]} />
            <meshBasicMaterial
              color={currentGesture === 'pinch' ? '#ff4081' : '#4fc3f7'}
              transparent
              opacity={0.6}
            />
          </mesh>

          {/* Cursor sphere at ray tip */}
          <Sphere args={[0.02, 16, 16]} position={[0, 0, -2]}>
            <meshBasicMaterial
              color={currentGesture === 'pinch' ? '#ff4081' : '#4fc3f7'}
            />
          </Sphere>
        </group>
      )}

      {/* Gesture indicator */}
      {currentGesture !== 'idle' && (
        <Text
          position={[
            controllerPosition.x,
            controllerPosition.y + 0.1,
            controllerPosition.z,
          ]}
          fontSize={0.03}
          color="#ffffff"
          anchorX="center"
          anchorY="bottom"
        >
          {currentGesture.toUpperCase()}
        </Text>
      )}
    </group>
  )
}

export default XRHandController
