/**
 * XR Entry Button Component
 * Provides UI for entering VR/AR mode on supported devices
 */

import React, { useState, useEffect } from 'react'
import { Button, Typography, Tooltip, Chip, Stack } from '@mui/material'
import VrpanoIcon from '@mui/icons-material/Vrpano'
import ViewInArIcon from '@mui/icons-material/ViewInAr'
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows'
import { useXRStore, XRMode } from '@/stores/XRStore'

interface XRCapabilities {
  vr: boolean
  ar: boolean
}

const XRButton: React.FC = () => {
  const { mode, setMode, isSessionActive } = useXRStore()
  const [capabilities, setCapabilities] = useState<XRCapabilities>({
    vr: false,
    ar: false,
  })
  const [isChecking, setIsChecking] = useState(true)

  // Check XR capabilities
  useEffect(() => {
    const checkCapabilities = async () => {
      setIsChecking(true)

      if (!('xr' in navigator)) {
        setCapabilities({ vr: false, ar: false })
        setIsChecking(false)
        return
      }

      try {
        const xr = (navigator as any).xr
        const [vrSupported, arSupported] = await Promise.all([
          xr.isSessionSupported('immersive-vr').catch(() => false),
          xr.isSessionSupported('immersive-ar').catch(() => false),
        ])

        setCapabilities({
          vr: vrSupported,
          ar: arSupported,
        })
      } catch (error) {
        console.error('Failed to check XR capabilities:', error)
        setCapabilities({ vr: false, ar: false })
      }

      setIsChecking(false)
    }

    checkCapabilities()
  }, [])

  const handleModeChange = (newMode: XRMode) => {
    setMode(newMode)
  }

  const isVisionPro = /Apple.*Safari/.test(navigator.userAgent) && capabilities.ar

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}
    >
      {/* Device detection chip */}
      {isVisionPro && (
        <Chip
          label="Vision Pro Detected"
          color="primary"
          size="small"
          sx={{ mb: 1 }}
        />
      )}

      {/* Mode buttons */}
      <Stack direction="row" spacing={1}>
        {/* Desktop Mode */}
        <Tooltip title="Standard 3D view">
          <Button
            variant={mode === 'desktop' ? 'contained' : 'outlined'}
            onClick={() => handleModeChange('desktop')}
            startIcon={<DesktopWindowsIcon />}
            sx={{
              minWidth: 100,
              backgroundColor:
                mode === 'desktop' ? 'primary.main' : 'transparent',
              borderColor: 'primary.main',
              '&:hover': {
                backgroundColor:
                  mode === 'desktop' ? 'primary.dark' : 'rgba(79, 195, 247, 0.1)',
              },
            }}
          >
            Desktop
          </Button>
        </Tooltip>

        {/* VR Mode */}
        <Tooltip
          title={
            capabilities.vr
              ? 'Enter Virtual Reality mode'
              : 'VR not supported on this device'
          }
        >
          <span>
            <Button
              variant={mode === 'vr' ? 'contained' : 'outlined'}
              onClick={() => handleModeChange('vr')}
              startIcon={<VrpanoIcon />}
              disabled={!capabilities.vr || isChecking}
              sx={{
                minWidth: 100,
                backgroundColor:
                  mode === 'vr' ? 'secondary.main' : 'transparent',
                borderColor: capabilities.vr ? 'secondary.main' : 'grey.600',
                color: capabilities.vr ? undefined : 'grey.600',
                '&:hover': {
                  backgroundColor:
                    mode === 'vr' ? 'secondary.dark' : 'rgba(255, 64, 129, 0.1)',
                },
                '&.Mui-disabled': {
                  borderColor: 'grey.700',
                  color: 'grey.700',
                },
              }}
            >
              VR
            </Button>
          </span>
        </Tooltip>

        {/* AR Mode */}
        <Tooltip
          title={
            capabilities.ar
              ? 'Enter Augmented Reality mode (Vision Pro)'
              : 'AR not supported on this device'
          }
        >
          <span>
            <Button
              variant={mode === 'ar' ? 'contained' : 'outlined'}
              onClick={() => handleModeChange('ar')}
              startIcon={<ViewInArIcon />}
              disabled={!capabilities.ar || isChecking}
              sx={{
                minWidth: 100,
                backgroundColor: mode === 'ar' ? '#9c27b0' : 'transparent',
                borderColor: capabilities.ar ? '#9c27b0' : 'grey.600',
                color: capabilities.ar ? undefined : 'grey.600',
                '&:hover': {
                  backgroundColor:
                    mode === 'ar' ? '#7b1fa2' : 'rgba(156, 39, 176, 0.1)',
                },
                '&.Mui-disabled': {
                  borderColor: 'grey.700',
                  color: 'grey.700',
                },
              }}
            >
              AR
            </Button>
          </span>
        </Tooltip>
      </Stack>

      {/* Session status */}
      {isSessionActive && (
        <Typography
          variant="caption"
          sx={{
            mt: 1,
            color: 'success.main',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#4caf50',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
          XR Session Active
        </Typography>
      )}

      {/* Instructions */}
      {mode !== 'desktop' && !isSessionActive && (
        <Typography
          variant="caption"
          sx={{
            mt: 1,
            color: 'text.secondary',
            textAlign: 'center',
            maxWidth: 300,
          }}
        >
          {mode === 'vr'
            ? 'Put on your VR headset to enter immersive mode'
            : 'Position your device to view the MRT network in AR'}
        </Typography>
      )}
    </div>
  )
}

export default XRButton
