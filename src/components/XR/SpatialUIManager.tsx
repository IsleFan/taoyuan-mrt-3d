/**
 * Spatial UI Manager
 * Manages 3D floating UI panels for VR/AR environments
 */

import React from 'react'
import { useXRStore } from '@/stores/XRStore'
import SpatialPanel from './SpatialPanel'
import StatusPanel3D from './panels/StatusPanel3D'
import AlertsPanel3D from './panels/AlertsPanel3D'
import TrainDetailPanel3D from './panels/TrainDetailPanel3D'
import SettingsPanel3D from './panels/SettingsPanel3D'

const SpatialUIManager: React.FC = () => {
  const { panels, selectedPanelId, selectPanel, updatePanel } = useXRStore()

  const renderPanelContent = (type: string) => {
    switch (type) {
      case 'status':
        return <StatusPanel3D />
      case 'alerts':
        return <AlertsPanel3D />
      case 'train-detail':
        return <TrainDetailPanel3D />
      case 'settings':
        return <SettingsPanel3D />
      default:
        return null
    }
  }

  return (
    <group name="spatial-ui-manager">
      {panels
        .filter((panel) => panel.isVisible)
        .map((panel) => (
          <SpatialPanel
            key={panel.id}
            id={panel.id}
            position={[panel.position.x, panel.position.y, panel.position.z]}
            rotation={[panel.rotation.x, panel.rotation.y, panel.rotation.z]}
            scale={panel.scale}
            isSelected={selectedPanelId === panel.id}
            isLocked={panel.isLocked}
            onSelect={() => selectPanel(panel.id)}
            onMove={(newPosition) =>
              updatePanel(panel.id, {
                position: { x: newPosition[0], y: newPosition[1], z: newPosition[2] },
              })
            }
          >
            {renderPanelContent(panel.type)}
          </SpatialPanel>
        ))}
    </group>
  )
}

export default SpatialUIManager
