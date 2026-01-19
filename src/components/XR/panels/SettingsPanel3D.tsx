/**
 * 3D Settings Panel for VR/AR
 * Allows users to configure XR experience settings in 3D space
 */

import React, { useState } from 'react'
import { Text, Box, RoundedBox, Sphere } from '@react-three/drei'
import { useXRStore } from '@/stores/XRStore'

interface ToggleButtonProps {
  label: string
  value: boolean
  onChange: () => void
  position: [number, number, number]
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  label,
  value,
  onChange,
  position,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <group position={position}>
      {/* Label */}
      <Text
        fontSize={0.018}
        color="#ffffff"
        anchorX="left"
        anchorY="middle"
        position={[-0.25, 0, 0]}
      >
        {label}
      </Text>

      {/* Toggle switch */}
      <group
        position={[0.2, 0, 0]}
        onClick={(e) => {
          e.stopPropagation()
          onChange()
        }}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
      >
        <RoundedBox
          args={[0.08, 0.03, 0.01]}
          radius={0.015}
        >
          <meshBasicMaterial
            color={value ? '#4caf50' : '#555555'}
            transparent
            opacity={isHovered ? 1 : 0.8}
          />
        </RoundedBox>
        <Sphere
          args={[0.012, 16, 16]}
          position={[value ? 0.02 : -0.02, 0, 0.01]}
        >
          <meshBasicMaterial color="#ffffff" />
        </Sphere>
      </group>
    </group>
  )
}

interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
  position: [number, number, number]
}

const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  onChange: _onChange,
  position,
}) => {
  const normalizedValue = (value - min) / (max - min)

  return (
    <group position={position}>
      {/* Label */}
      <Text
        fontSize={0.018}
        color="#ffffff"
        anchorX="left"
        anchorY="middle"
        position={[-0.25, 0.02, 0]}
      >
        {label}
      </Text>

      {/* Value display */}
      <Text
        fontSize={0.015}
        color="#4fc3f7"
        anchorX="right"
        anchorY="middle"
        position={[0.25, 0.02, 0]}
      >
        {value.toFixed(1)}
      </Text>

      {/* Slider track */}
      <group position={[0, -0.01, 0]}>
        <Box args={[0.4, 0.008, 0.005]}>
          <meshBasicMaterial color="#333333" />
        </Box>

        {/* Filled portion */}
        <Box
          args={[0.4 * normalizedValue, 0.008, 0.006]}
          position={[-0.2 + (0.4 * normalizedValue) / 2, 0, 0.001]}
        >
          <meshBasicMaterial color="#4fc3f7" />
        </Box>

        {/* Slider knob */}
        <Sphere
          args={[0.015, 16, 16]}
          position={[-0.2 + 0.4 * normalizedValue, 0, 0.01]}
        >
          <meshBasicMaterial color="#ffffff" />
        </Sphere>
      </group>
    </group>
  )
}

const SettingsPanel3D: React.FC = () => {
  const { settings, updateSettings, worldScale, setWorldScale, resetPanels } =
    useXRStore()

  return (
    <group>
      {/* Title */}
      <Text
        fontSize={0.035}
        color="#4fc3f7"
        anchorX="center"
        anchorY="top"
        position={[0, 0.22, 0]}
        fontWeight="bold"
      >
        Settings
      </Text>

      {/* Toggle Settings */}
      <ToggleButton
        label="Hand Tracking"
        value={settings.handTrackingEnabled}
        onChange={() =>
          updateSettings({ handTrackingEnabled: !settings.handTrackingEnabled })
        }
        position={[0, 0.12, 0]}
      />

      <ToggleButton
        label="Haptic Feedback"
        value={settings.hapticFeedback}
        onChange={() =>
          updateSettings({ hapticFeedback: !settings.hapticFeedback })
        }
        position={[0, 0.07, 0]}
      />

      <ToggleButton
        label="Passthrough"
        value={settings.passthrough}
        onChange={() => updateSettings({ passthrough: !settings.passthrough })}
        position={[0, 0.02, 0]}
      />

      <ToggleButton
        label="Sound"
        value={settings.soundEnabled}
        onChange={() =>
          updateSettings({ soundEnabled: !settings.soundEnabled })
        }
        position={[0, -0.03, 0]}
      />

      {/* Slider Settings */}
      <Slider
        label="UI Scale"
        value={settings.uiScale}
        min={0.5}
        max={2}
        onChange={(v) => updateSettings({ uiScale: v })}
        position={[0, -0.1, 0]}
      />

      <Slider
        label="World Scale"
        value={worldScale}
        min={0.05}
        max={1}
        onChange={setWorldScale}
        position={[0, -0.16, 0]}
      />

      {/* Reset Button */}
      <group
        position={[0, -0.23, 0]}
        onClick={(e) => {
          e.stopPropagation()
          resetPanels()
        }}
      >
        <RoundedBox args={[0.2, 0.04, 0.01]} radius={0.01}>
          <meshBasicMaterial color="#ff4081" />
        </RoundedBox>
        <Text
          fontSize={0.015}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          position={[0, 0, 0.01]}
        >
          Reset Panels
        </Text>
      </group>
    </group>
  )
}

export default SettingsPanel3D
